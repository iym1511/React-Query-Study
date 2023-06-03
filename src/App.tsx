import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useQueries, useQuery } from 'react-query';
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
  const fetchPosts2 = async():Promise<jsonData[]> => {
    const response = await axios.get<jsonData[]>(`http://localhost:5000/ilyun`);
    return response.data
  }

  // json.data 담는곳
  // state에 담아서 사용할 상황에 사용 / map 안에서 매게변수로 담을수있음
  const [jsonData, setJsonData] = useState<jsonData[] | undefined>();

  
  const { status, isFetching, data, error } = useQuery<jsonData[]>('testJson', fetchPosts);
  // 아래 코드로 변수명을 지정해줘서도 사용가능한데
  // 그 이유는 가독성과 중복방지를 위함이다.
  const jinhyeQuery = useQuery<jsonData[]>('testJson', fetchPosts, { useErrorBoundary: (error: any) => error.response?.status >= 500, });
  const ilyun = useQuery<jsonData[]>('testJson2', fetchPosts2);
  


  // useQueries
  const result = useQueries([
    {
      queryKey: ["testJson"],
      queryFn :fetchPosts,
    },
    {
      queryKey: ["testJson2"],
      queryFn :fetchPosts2,
    },
  ]);
  const isLoading = result.some((result) => result.isLoading);
  const isError = result.some((result) => result.isError);

  if(isLoading) {
    return <div>Loading...</div>
  }
  if(isError) {
    return <div>Error occurred while fetching data.</div>
  }

  if (isFetching) {
    console.log('fetching...');
  }
  
  if (status === 'loading') {
    console.log('loading...');
  }
  
  if (status === 'error') {
    console.log('error', error);
  }
  
  

  return (
    <div className="App">
      {
        data?.map((a: jsonData)=>(
          <div key={a.id}>
            {a.love}
          </div>
        ))
      }
      {
        jinhyeQuery.data?.map((a)=>(
          <div key={a.id}>
            {a.name}
          </div>
        ))
      }
      {
        result[1].data?.map((a)=>(
          <div>
            {a.name}
          </div>
        ))
      }
    </div>
  );
}

export default App;
