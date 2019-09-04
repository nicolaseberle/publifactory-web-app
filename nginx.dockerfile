FROM node:latest as build-front-stage
COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install --silent
RUN npm run build

FROM node:latest as build-back-stage

# Import pip and python packages needed
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python2 get-pip.py
RUN python3 get-pip.py
RUN python2 -m pip install --upgrade pip
RUN python2 -m pip install --no-cache-dir numpy plotly pandas
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install --no-cache-dir numpy plotly pandas

# Import R base and packages
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E298A3A825C0D65DFD57CBB651716619E084DAB9
RUN apt update
RUN apt install -y r-base
RUN R -e "install.packages('plotly',dependencies=TRUE, repos='http://cran.rstudio.com/')"
RUN R -e "install.packages('rjson',dependencies=TRUE, repos='http://cran.rstudio.com/')"
RUN R -e "install.packages('readr',dependencies=TRUE, repos='http://cran.rstudio.com/')"
RUN R -e "install.packages('dplyr',dependencies=TRUE, repos='http://cran.rstudio.com/')"

# Building API NodeJs
RUN mkdir /src
COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm i -g node-gyp
RUN npm i --save bcrypt
RUN npm i --silent

EXPOSE 4000
EXPOSE 4001

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm run server-prod

FROM nginx:1.17.2-alpine
# Create container's directory
RUN mkdir -p /etc/ssl/certs/
RUN mkdir -p /etc/ssl/private/
RUN mkdir -p /etc/nginx/snippets/

# Remove old conf.d
RUN rm -rf /etc/nginx/conf.d/*

# Copy all the files necessary to dump nginx server
COPY ./nginx/publifactory-nginx-frontend.conf /etc/nginx/conf.d/publifactory-nginx-frontend.conf
COPY ./nginx/publifactory-nginx-backend.conf /etc/nginx/conf.d/publifactory-nginx-backend.conf
COPY --from=build-front-stage /src/dist /usr/share/nginx/html

# Expose the port 80 for HTTP and port 443 for HTTPS
# The HTTP's port will redirect automatically on HTTPS from NGiNX
EXPOSE 80
EXPOSE 443