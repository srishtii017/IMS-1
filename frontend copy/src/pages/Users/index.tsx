import { FormEvent, useState } from 'react'; 
import BredCrums from '../../components/BredCrums'; 
import Model from './Components/Model.user'; 
import { useGetAllConsumersQuery } from '../../provider/queries/Users.query';
import Loader from '../../components/Loader';
import TableCard from './Components/Card.user';
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useSearchParams } from 'react-router-dom';

const UserPage = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [SearchParams] = useSearchParams();
  const Search = SearchParams.get("query") || '';
  
  const { isLoading, data, isFetching } = useGetAllConsumersQuery({
    query: Search,
    page: SearchParams.get("page") || 1
  });

  const handlePageChange = (direction: 'next' | 'prev') => {
    const page = Number(SearchParams.get("page")) || 1;
    const query = SearchParams.get("query") || '';
    const newPage = direction === 'next' ? page + 1 : page - 1;
    let string = query ? `?query=${query}&page=${newPage}` : `?page=${newPage}`;
    navigate(`/user` + string);
  };

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Search) return;
    navigate(`/user?query=${Search}&page=1`);
  };

  const users = data?.users || [];

  return (
    <>  
      <BredCrums PageLink='/user' PageName='Users' /> 
      <div className="mb-3 flex justify-end w-[90%] mx-auto">
        <button onClick={() => setVisible(!visible)} className="px-5 py-2 bg-purple-500 text-white rounded-sm">Add User</button>
      </div>

      <form onSubmit={onSubmitHandler} className="mb-3 flex justify-end w-[90%] mx-auto">
        <input 
          value={Search} 
          onChange={(e: any) => setSearch(e.target.value)} 
          className="w-[90%] mx-auto lg:mx-0 lg:w-1/2 rounded-sm border py-3 px-5 outline-none" 
          placeholder="Search User" 
        />
      </form>

      <div className={`mb-3 flex ${(Number(SearchParams.get("page")) || 1) > 1 ? 'justify-between' : 'justify-end'} w-[90%] mx-auto`}>
        {(Number(SearchParams.get("page")) || 1) > 1 && 
          <button onClick={() => handlePageChange('prev')} title='Prev Page' className="text-black text-xl lg:text-3xl p-2">
            <BsArrowLeftCircle />
          </button>
        }

        {data && data.more && 
          <button onClick={() => handlePageChange('next')} title='Next Page' className="text-black text-xl lg:text-3xl p-2">
            <BsArrowRightCircle />
          </button>
        }
      </div>

      <div className="w-full">
        {isLoading || isFetching ? <Loader /> : (
          <div className="relative overflow-x-auto shadow">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Mobile</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 && users.map((c: any, i: number) => (
                  <TableCard key={i} id={i + 1} data={c} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Model visible={visible} setVisible={setVisible} />
    </>
  );
};

export default UserPage;