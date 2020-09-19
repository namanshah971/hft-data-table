import React, {useEffect, useState} from 'react';
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'

import io from 'socket.io-client';
const socket = io('http://localhost:5000')


function App() {
  const [data,setData] = useState([]);
  const [threshold, setThreshold ] = useState(4003);
  const [columns, setColumns] = useState([{
    Header: 'SYMBOL',
    accessor:'symbol',
  },{
    Header: 'PRICE',
    accessor:'price',
    Cell: (row) => {
      if (row.value>= threshold)
        return <span>{row.value}</span>
      else
        return <span style={{backgroundColor:"red", width:"100%", height:"100%"}}>{row.value}</span>
    }
  }])


  useEffect(()=>{
    socket.on('receive_data', (new_data) => {
      if(new_data.length!==0){
        // setData([...new_data]);
        setData([...new_data, ...data].slice(0, 500));
      }
    })
  },[data])

  return (
   <div>
     <ReactTable data={data}
                 columns={columns}
                 style={{ width: '50%', marginLeft: "22%" }}
                 defaultPageSize={100} sortable={false}
                 className="-striped -highlight " />

    </div>
  );
}

export default App;
