import React, {useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import io from 'socket.io-client';


const socket = io('http://localhost:5000')
let last_batch = [];

function App() {

  const [gridApi, setGridApi] = useState(null);
  const [frequency, setFrequency] = useState(300);
  const [threshold, setThreshold ] = useState(4003);
  const [tempThreshold, setTempThreshold] = useState(0);

  function onSubmit(){
      setThreshold(parseInt(tempThreshold));
  }
  function onSubmitFrequency(){
      socket.emit('change_frequency', {'frequency': frequency });
  }
  function onGridReady(params) {
        setGridApi(params.api);
        params.api.setRowData([]);
    }

  useEffect(()=>{
    socket.on('receive_data', (new_data) => {
        if (gridApi!=null){
            let new_data_length = new_data.length;
            last_batch.push([...new_data]);

            if (gridApi.getModel().getRowCount() <= 500 - new_data_length) {
                gridApi.applyTransactionAsync({ add: new_data , addIndex: 0});
            }
            else {
                let remove = last_batch.shift();
                gridApi.applyTransactionAsync({ remove: remove});
                gridApi.applyTransactionAsync({ add: new_data , addIndex: 0});
            }
        }
    });
  },[gridApi]);

  useEffect(()=>{
      if(gridApi){
          gridApi.flushAsyncTransactions();
          gridApi.setColumnDefs([
              {headerName: 'SYMBOL', field: 'symbol', sortable:true},
              {headerName: 'PRICE', field: 'price',sortable:true ,volatile: true,
                  cellStyle: function(params) {
                      if (params.value < threshold) {
                          return {backgroundColor: 'red'};
                      } else {
                          return {backgroundColor: 'green'};
                      }
                  }
              }]);
      }

    },[threshold])

  return (
      <div>
          <div
              className="ag-theme-balham"
              style={{ height: '90vh', width:"400px", marginLeft:"35vw"}}>
            <AgGridReact
                onGridReady={onGridReady}
                pagination={true}
                columnDefs={[
                    {headerName: 'SYMBOL', field: 'symbol', sortable:true},
                    {headerName: 'PRICE', field: 'price',sortable:true ,volatile: true,
                        cellStyle: function(params) {
                            if (params.value < threshold) {
                                return {backgroundColor: 'red'};
                            } else {
                                return {backgroundColor: 'green'};
                            }
                        }
                    }]}>
            </AgGridReact>
          </div>
          <div style={{marginLeft:"35vw", marginTop:"2vh"}}>
            <TextField label={"threshold"}
                       type={"number"}
                       style={{width:"8vw"}}
                       onChange={(e)=>setTempThreshold(parseInt(e.target.value))}
                       defaultValue={threshold}
            />
            <Button type={"submit"} onClick={onSubmit}>Submit</Button>

              <TextField label={"frequency (ms)"}
                         style={{width:"8vw", marginLeft:"2vw"}}
                         onChange={(e)=>setFrequency(parseInt(e.target.value))}
                         defaultValue={frequency}
              />
              <Button type={"submit"} onClick={onSubmitFrequency}>Submit</Button>
          </div>
      </div>
  );
}

export default App;
