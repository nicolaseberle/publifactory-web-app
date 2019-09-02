#!/bin/bash

# Syntax Coloration for PROMPT
RED='\033[0;31m' # Red Color
NC='\033[0m' # No Color

# Constants
DATE_BEGIN=$(date +%s)
USER=$(whoami)
CWD='/home/nicolas/web-app'

# Variable
command=$1
options=$2

export BASE_MONGO=localhost
export BASE_API=localhost
export SITE_IP='35.246.243.12'
export ROOT_APP="http://${SITE_IP}/"

debug () {
  # shellcheck disable=SC2059
  printf "${RED}$(date '+%H:%M:%S:%N')${NC} -> $1";
}

print_help () {
  printf "USAGE\n"
  # shellcheck disable=SC2059
  printf "$0 {COMMAND} [OPTIONS]\n\n"
  printf "COMMAND:\n"
  printf "start\tBegin the script and launch the docker.\n"
  printf "stop\tStop the docker and close well everything.\n"
  printf "restart\tRun stop and start the docker.\n"
  printf "test\tRun the mocha tests.\n"
  printf "deploy\tRun stop, test and start.\n"
  printf "save\tCreate mongo dump for cron jobs.\n"
  printf "help\tDisplay this box.\n\n"
  printf "OPTIONS:\n"
  printf "dev\tLaunch the dev options with logs and webpack dev server.\n"
  printf "prod\tLaunch the prod options with nginx.\n"
}

build_container () {
  echo -ne '##############            (66%)\r'
  debug "Begin build container.\n"
  sudo docker-compose build
  echo -ne '###############           (72%)\r'
  debug "Images built.\n"
}

up_database () {
  # shellcheck disable=SC2012
  db_chosen=$(ls -lt ${CWD}/database/ | awk '{print $9}' | tail +2 | head -1)
  debug "Up the database.\n"
  echo -ne '################          (76%)\r'
  sudo docker-compose up -d mongo
  debug 'Populating database'
  # shellcheck disable=SC2046
  sudo cat ${CWD}/database/"${db_chosen}" | sudo docker exec -i $(sudo docker ps -f name=mongo -q) sh -c 'mongorestore --archive'
  echo -ne '#################         (80%)\r'
}

execution_time () {
  date_end=$(date +%s)
  # shellcheck disable=SC2003
  diff=$(expr "${date_end}" - "${DATE_BEGIN}")
  # shellcheck disable=SC2003
  second=$(expr "${diff}" % 60)
  # shellcheck disable=SC2003
  minute=$(expr "${diff}" / 60)
  debug "Execution time : $minute minutes and $second second"
}

start () {
  build_container
  up_database
  echo -ne '###################       (88%)\r'
  debug "Up the API.\n"
  sudo docker-compose up --no-deps -d api
  debug "Up the client WebApp.\n"
  echo -ne '##################        (84%)\r'
  if [[ ${options} = "prod" ]];
  then
    debug "Create fake certificates with certbot\n"
    yes y | sudo ./init-letsencrypt.sh
    debug "Up NGiNX \n"
    sudo docker-compose up --no-deps -d nginx
  else
    debug "Launching the DEV app\n"
    sudo docker-compose up -d client_dev
  fi
  debug "All is up.\n"
}

stop () {
  debug "Stopping every container and networks.\n"
  sudo docker-compose down
  debug "Docker stopped every container !"
  debug "Verifying if the container are not still running...\n"
  # shellcheck disable=SC2046
  sudo docker stop $(docker ps -a | awk '{if(NR>1)print $1}')
  debug "Checking database...\n"
  # shellcheck disable=SC2046
  sudo kill -9 $(sudo lsof -i -P -n | grep LISTEN | grep 27017 | awk '{print $2}')
  # shellcheck disable=SC2046
  debug "Checking API...\n"
  # shellcheck disable=SC2046
  sudo kill -9 $(sudo lsof -i -P -n | grep LISTEN | grep 4000 | awk '{print $2}')
  debug "Checking SSH tunnel...\n"
  # shellcheck disable=SC2046
  sudo kill -9 $(sudo lsof -i -P -n | grep LISTEN | grep 22 | awk '{print $2}')
  # shellcheck disable=SC2046
  debug "Checking client application...\n"
  # shellcheck disable=SC2046
  sudo kill -9 $(sudo lsof -i -P -n | grep LISTEN | grep 9001 | awk '{print $2}')
  debug "Removing containers"
  # shellcheck disable=SC2046
  sudo docker rm $(docker ps -a | awk '{if(NR>1)print $1}')
  debug "Every programs has been stopped !...\n"
}

make_test () {
  sudo apt-get install -y nodejs
  sudo docker-compose build mongo
  up_database
  npm install --silent
  npm test
  stop
}

save_data () {
  # shellcheck disable=SC2012
  files_number=$(ls -lrt ${CWD}/database | awk '{print $9}' | tail +2 | wc -l)
  if [[ ${files_number} -gt 5 ]];
  then
    cd ${CWD}/database || exit
    # shellcheck disable=SC2046
    # shellcheck disable=SC2012
    # shellcheck disable=SC2003
    sudo rm -f $(ls -lrt ${CWD}/database | awk '{print $9}' | tail +2 | head -$(expr "${files_number}" - 5))
    cd ..
  fi
  debug "Creating the database dump file"
  # shellcheck disable=SC2046
  sudo docker exec $(sudo docker ps -f name=mongo -q) sh -c 'mongodump --archive' | sudo tee ${CWD}/database/db_"${DATE_BEGIN}".dump
}


echo -ne '#                         (5%)\r'
if [[ ${USER} != 'root' ]];
then
  debug "You must be root to execute this script.\n"
  exit 1
fi

echo -ne '##                        (10%)\r'
if [[ "$#" -lt 1 ]];
then
  debug "You must provide a command after the binary.\n"
  print_help
  exit 1
fi

case "$command" in
  start)
    echo -ne '######                    (33%)\r'
    start
    sudo docker-compose up --no-deps -d whale
    echo -ne '########################  (100%)\r'
    debug "[SCRIPT FINISHED SUCCESSFULLY]\n"
    execution_time
    exit 0
    ;;
  stop)
    echo -ne '########                  (33%)\r'
    stop
    echo -ne '########################  (100%)\r'
    execution_time
    debug "[SCRIPT FINISHED SUCCESSFULLY]\n"
    exit 0
    ;;
  test)
    echo -ne '######                    (33%)\r'
    make_test
    echo -ne '########################  (100%)\r'
    debug "[SCRIPT FINISHED SUCCESSFULLY]\n"
    execution_time
    exit 0
    ;;
  deploy)
    echo -ne '######                    (33%)\r'
    stop
    make_test
    start
    sudo docker-compose up --no-deps -d whale
    echo -ne '########################  (100%)\r'
    debug "[SCRIPT FINISHED SUCCESSFULLY]\n"
    execution_time
    exit 0
    ;;
  help)
    print_help
    exit 0
    ;;
  restart)
    echo -ne '########                  (33%)\r'
    stop
    echo -ne '##############            (66%)\r'
    # shellcheck disable=SC2086
    start
    sudo docker-compose up --no-deps -d whale
    execution_time
    echo -ne '########################  (100%)\r'
    debug "[SCRIPT FINISHED SUCCESSFULLY]\n"
    exit 0
    ;;
  save)
    echo -ne '########                  (33%)\r'
    save_data
    echo -ne '#####################     (90%)\r'
    execution_time
    echo -ne '########################  (100%)\r'
    debug "[SCRIPT FINISHED SUCCESSFULLY]\n"
    exit 0
    ;;
  *)
    debug "$command is an unknown command.\n"
    print_help
    exit 1
esac
