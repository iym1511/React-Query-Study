import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery } from 'react-query';
import axios from 'axios';
import { promises } from 'dns';


interface jsonData {
  id: number;
  love: number;
  name: string;
}

function App() {

  const fetchPosts = async():Promise<jsonData[]> => {
    const response = await axios.get<jsonData[]>(`http://localhost:5000/jinhye`);
    return response.data
  }

  // json.data 담는곳
  // state에 담아서 사용할 상황에 사용 / map 안에서 매게변수 담을수있음
  const [jsonData, setJsonData] = useState<jsonData[] | undefined>();

  const { status, isFetching, data, error } = useQuery<jsonData[]>('testJson', fetchPosts);
  
  if (isFetching) {
    console.log('fetching...');
  }
  
  if (status === 'loading') {
    console.log('loading...');
  }
  
  if (status === 'error') {
    console.log('error', error);
  }
  
  // 일어나서 useQueries 공부
  
  return (
    <div className="App">
      {
        data?.map((a: jsonData)=>(
          <div key={a.id}>
            {a.love}
          </div>
        ))
      }
    </div>
  );
}

export default App;
