import { FormEvent, useState } from 'react';
import BredCrums from '../../components/BredCrums';
import Loader from '../../components/Loader';
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddOrderModel from './components/AddOrder.model';
import { useGetAllOrdersQuery } from '../../provider/queries/Orders.query';
import TableCard from './components/Card.order';

const OrdersPage = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [SearchParams] = useSearchParams();
  const [Search, setSearch] = useState(SearchParams.get("query") || '');
  const { data, isLoading, isError } = useGetAllOrdersQuery({ query: SearchParams.get("query") || '', page: SearchParams.get("page") || 1 });

  // Loader and Error State Handling
  if (isLoading) return <Loader />;
  if (isError) return <h1>Something went wrong! Please try again later.</h1>;

  // Handle search submit
  const SearchHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/orders?query=${Search}&page=1`);
  }

  // Pagination logic - abstracted
  const handlePagination = (direction: 'next' | 'prev') => {
    const page = Number(SearchParams.get("page")) || 1;
    const query = SearchParams.get("query") || '';
    let newPage = direction === 'next' ? page + 1 : page - 1;

    if (newPage < 1) newPage = 1; // Prevent going to a negative page number

    const string = query ? `?query=${query}&page=${newPage}` : `?page=${newPage}`;
    navigate(`/orders${string}`);
  }

  return (
    <>
      <BredCrums PageLink='/orders' PageName='Orders' />

      <div className="mb-3 flex justify-end w-[90%] mx-auto">
        <button onClick={() => setVisible(!visible)} className="px-5 py-2 bg-purple-500 text-white rounded-sm">Add Orders</button>
      </div>

      <form onSubmit={SearchHandler} className="mb-3 flex justify-end w-[90%] mx-auto">
        <input
          value={Search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[90%] mx-auto lg:mx-0 lg:w-1/2 rounded-sm border py-3 px-5 outline-none"
          placeholder="Search Orders"
        />
      </form>

      <div className={`mb-3 flex ${(Number(SearchParams.get("page")) || 1) > 1 ? 'justify-between' : 'justify-end'} w-[90%] mx-auto`}>
        {(Number(SearchParams.get("page")) || 1) > 1 && (
          <button
            onClick={() => handlePagination('prev')}
            title='Prev Page'
            className="text-black text-xl lg:text-3xl p-2"
          >
            <BsArrowLeftCircle />
          </button>
        )}

        {data && data.hasMore && (
          <button
            onClick={() => handlePagination('next')}
            title='Next Page'
            className="text-black text-xl lg:text-3xl p-2"
          >
            <BsArrowRightCircle />
          </button>
        )}
      </div>

      <div className="relative overflow-x-auto shadow">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Items</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.length > 0 && data.data.map((order: any, index: number) => (
              <TableCard key={index} id={index + 1} data={order} />
            ))}
          </tbody>
        </table>
      </div>

      <AddOrderModel visible={visible} setVisible={setVisible} />
    </>
  );
}

export default OrdersPage;
