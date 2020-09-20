#!/bin/bash -e
Script_Version="1.0"

showHelp() {
cat<<EOF
   Usage: ./run.sh [option]

    -h, -help, --help                        Display help
    -v, -version, --version                  Show script version
    -r ,  -run, --run                        Run Flask and React App
    -rr, --runreact, -runreact               Run React App
    -rf, --runflask, -runflask               Run Flask App
EOF
}

runReactApp(){
cd ../client
npm i
npm start
}

runFlaskApp(){
cd datafeed
python3 -m venv test_env
source test_env/bin/activate
pip3 install -r requirements.txt
python3 server.py &
}

case $1 in
        -h|--help|-help)
            showHelp
            ;;
        -v|--version|-version)
            echo ${Script_Version}
            ;;
        -r|--run|-run)
            runFlaskApp
            runReactApp
            ;;
        -rr|--runreact|-runreact)
            runReactApp
            ;;
        -rf|--runflask|-runflask)
            runFlaskApp
            ;;
        *)
            showHelp
            ;;
esac
exit 0
