# Real-Time High Frequency Data Table 

A web app which shows real time data with features such as settable frequency and threshold. 
The backend generates random values at frequency as high as 50elements/100ms and sends is to the frontend app which dispalyes it in real time through websockets (socket.io).

## Getting Started

``git clone <ssh link> `` if taken from github to get started. Then run the following commands.
```
cd lighthouse
chmod a+x run.sh
./run.sh -h
```
```
 Usage: ./run.sh [option]

    -h, -help, --help                        Display help
    -v, -version, --version                  Show script version
    -r ,  -run, --run                        Run Flask and React App
    -rr, --runreact, -runreact               Run React App
    -rf, --runflask, -runflask               Run Flask App
```
You could use the options to run both the apps and get started. 

### What's Included

* [client](client) with the necessary react app files.
* [datafeed](datafeed) with necessary flask files.
* [run.sh](run.sh) to help start the apps

### Features

1. Settable frequency
2. Settable threshold which colors the cell > threshold green else red
3. Sortable both columns (Symbol, Price) by clicking on them 

## Built With

* [ReactJS](https://reactjs.org/docs/getting-started.html) - The frontend framework used
* [Flask](https://flask.palletsprojects.com/en/1.0.x/) - The backend framework used

### Next Steps
1. Increased Error Checking
2. Making UI more user-friendly
3. Saving and Querying old data

## Author
Naman Shah https://github.com/namanshah971



