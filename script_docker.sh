#!/bin/sh

# Define global variables

# Syntax Coloration for PROMPT
RED='\033[0;31m' # Red Color
NC='\033[0m' # No Color

DATE_BEGIN=`date +%s`
USER=`whoami`

# Store args in variable
command=$1
options=$2

debug () {
  printf "${RED}`date '+%H:%M:%S:%N'`${NC} -> $1";
}

log_path="`pwd`/logs/${DATE_BEGIN}.log"
debug "All the logs will be saved in $log_path\n"

print_help () {
  printf "USAGE\n"
  printf "$0 {COMMAND} [OPTIONS]\n\n"
  printf "COMMAND:\n"
  printf "start\tBegin the script and launch the docker.\n"
  printf "stop\tStop the docker and close well everything.\n"
  printf "help\tDisplay this box.\n\n"
  printf "OPTIONS:\n"
  printf "dev\tLaunch the dev options with logs and webpack dev server"
  printf "prod\tLaunch the prod options with nginx"
}

execution_time () {
  date_end=`date +%s`
  diff=`expr ${date_end} - ${DATE_BEGIN}`
  second=`expr ${diff} % 60`
  minute=`expr ${diff} / 60`
  debug "Execution time : $minute minutes and $second second"
}

start () {
  echo -ne '##############            (66%)\r'
  debug "Begin build container.\n"
  sudo docker-compose build
  echo -ne '###############           (72%)\r'
  debug "Images built.\n"
  debug "Up the database.\n"
  echo -ne '################          (76%)\r'
  sudo docker-compose up --no-deps -d mongo
  echo -ne '#################         (80%)\r'
  debug "Up ssh tunnel to access data visualization.\n"
  sudo docker-compose up --no-deps -d ssh_tunnel
  debug "Up the client WebApp.\n"
  echo -ne '##################        (84%)\r'
  if [[ ${options} = "prod" ]];
  then
    echo "prod"
  else
    debug "Launching the DEV app\n"
    sudo docker-compose up --no-deps -d client_dev
  fi
  echo -ne '###################       (88%)\r'
  debug "Up the API.\n"
  sudo docker-compose up --no-deps -d api
  debug "All is up.\n"
}

stop () {
  debug "Stopping every container and networks.\n"
  sudo docker-compose down
  debug "Docker stopped every container !"
  debug "Verifying if the container are not still running...\n"
  sudo docker stop `docker ps -a | awk '{if(NR>1)print $1}'`
  debug "Checking database...\n"
  sudo kill -9 `sudo lsof -i -P -n | grep LISTEN | grep 27017 | awk '{print $2}'`
  debug "Checking API...\n"
  sudo kill -9 `sudo lsof -i -P -n | grep LISTEN | grep 4000 | awk '{print $2}'`
  debug "Checking SSH tunnel...\n"
  sudo kill -9 `sudo lsof -i -P -n | grep LISTEN | grep 22 | awk '{print $2}'`
  debug "Checking client application...\n"
  sudo kill -9 `sudo lsof -i -P -n | grep LISTEN | grep 9001 | awk '{print $2}'`
  debug "Removing containers"
  sudo docker rm `docker ps -a | awk '{if(NR>1)print $1}'`
  debug "Every programs has been stopped !...\n"
  debug "Removing node_modules folder...\n"
  rm -rf ./node_modules/
  debug "Removing package-lock...\n"
  rm -f ./package-lock.json
}

save_database () {
  debug "Creating a dump in ./database..."
  mongodump -o ./database
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
    start >> ${log_path} 2>&1
    echo -ne '########################  (100%)\r\n'
    debug "[SCRIPT FINISHED SUCCESSFULLY]\n"
    execution_time
    exit 0
    ;;
  stop)
    echo -ne '########                  (33%)\r'
    stop >> ${log_path} 2>&1
    echo -ne '########################  (100%)\r\n'
    execution_time
    debug "[SCRIPT FINISHED SUCCESSFULLY]\n"
    exit 0
    ;;
  help)
    print_help
    exit 0
    ;;
  restart)
    echo -ne '########                  (33%)\r'
    stop >> ${log_path} 2>&1
    echo -ne '##############            (66%)\r'
    start >> ${log_path} 2>&1
    echo -ne '#####################     (90%)\r'
    execution_time
    echo -ne '########################  (100%)\r\n'
    debug "[SCRIPT FINISHED SUCCESSFULLY]\n"
    exit 0
    ;;
  dump)
    save_database
    exit 0
    ;;
  *)
    debug "$command is an unknown command.\n"
    print_help
    exit 1
esac
