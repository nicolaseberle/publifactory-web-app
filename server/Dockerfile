FROM node:latest

# Import pip and python packages needed
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python2 get-pip.py && \
    python3 get-pip.py
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

# Creating directories
RUN mkdir /src

# Add Tini
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# Add NodeJs directory
COPY ./ /src
WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install --silent
EXPOSE 4000

## Wait for db to be up
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm start
