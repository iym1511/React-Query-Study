import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { QueryClient, useMutation, useQueries, useQuery } from 'react-query';
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
  const jinhyeQuery = useQuery<jsonData[]>('testJson', fetchPosts, { useErrorBoundary: (error: any) => error.response?.status >= 500 });
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

  // useMutation
  const testMutation = useMutation(fetchPosts,{
    onMutate: (variables) => { 
      /* 요청 직전 처리, 여기서 반환하는 값은 하단 함수들의 context로 사용됨 */
      console.log(variables)
    },
    onError: (error, variables, context) => {
      /* 오류 발생 시 처리 */
    },
    onSuccess: (data, variables, context) => {
      /* 성공 시 처리 */
      console.log(data)
      console.log(variables)
    },
    onSettled: (data, error, variables, context) => {
      /* 성공 여부와 관계없이 작업이 끝나면 처리 */
    }
  });

  const queryClient = new QueryClient();

  const mutation = useMutation(
    'UpdateUser',
    (param: any) => axios.put(`http://localhost:5000/ilyun`,param),
    {
      onSuccess: (data, variables, context) => {
        queryClient.setQueryData('getUser', data)
        // console.log('onSuccess', data);
      }
    }
    );
    const handleUpdateUser = () => {
      mutation.mutate({
        id: 1,
        name: 'Updated User'
      });
    };

    const users = [1, 2, 3, 4, 5];

    const results = useQueries(
      users.map(user => {
        return {
          queryKey: ['getUser', user],
          queryFn: () => axios.get(`https://jsonplaceholder.typicode.com/users/${user}`)
        }
      })
    );
    console.log(results)

      const mutation5 = useMutation(
        'updateUser',
        (updatedUser: any) => axios.put(
          `https://jsonplaceholder.typicode.com/users/1`,
          updatedUser
        ),
        {
          onSuccess: (data, variables, context) => {
            // 수정이 성공한 경우 실행되는 콜백 함수
            // console.log('User updated successfully:', data);
            // 필요한 경우 queryClient를 사용하여 데이터 업데이트
            queryClient.setQueryData('getUser', data);
          }
        }
      );
      
      // 사용자 정보 수정을 실행하는 함수
      const handleUpdateUser5 = () => {
        const updatedUser2 = {
          id: 1,
          name: 'Updated Name',
          email: 'updatedemail@example.com'
          // 필요한 경우 다른 필드도 업데이트 가능
        };
        mutation5.mutate(updatedUser2);
      };
        console.log(mutation5)


    
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
            {a.id}
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
      {/* {
        mutation4.data?.data?.map((a:any) => (
          <div>
            {a.name}
          </div>
        ))
      } */}
      <div>
        <button onClick={handleUpdateUser5}>mutate 버튼</button>
      </div>
    </div>
  );
}

export default App;
