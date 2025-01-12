import { Dialog } from 'primereact/dialog';
import { useGetInvoiceByIdQuery } from '../../../provider/queries/Orders.query';
import Loader from '../../../components/Loader';
import moment from 'moment';
import Barcode from 'react-barcode';
import { usePDF } from 'react-to-pdf';

const ShowAndPrintModel = ({ setVisible, visible, id }: any) => {
  const { data, isLoading, isError, isFetching } = useGetInvoiceByIdQuery(id);
  const { toPDF, targetRef } = usePDF();

  // If data is still loading or fetching, show the Loader
  if (isFetching || isLoading) {
    return <Loader />;
  }

  // If there's an error while fetching the data
  if (isError) {
    return <div>Something went wrong</div>;
  }

  // Type definition for Order items
  type OrderDoc = {
    name: string;
    id: string;
    price: number;
  };

  return (
    <>
      <Dialog
        draggable={false}
        visible={visible}
        className="w-[90%] mx-auto lg:mx-0 lg:w-1/2"
        onHide={() => setVisible(false)}
      >
        <div ref={targetRef} className="m-0 px-5">
          {/* Order details */}
          <div className="flex items-start gap-x-10 py-5 justify-between">
            <div className="w-1/2 flex flex-col gap-y-2">
              <h1 className="font-semibold text-xl capitalize">
                {data?.consumer?.name}
              </h1>
              <p className="text-sm">{data?.consumer?.address}</p>
              <p className="font-semibold">
                Date: {moment(new Date(data.createdAt)).format('lll')}
              </p>
            </div>
            <div className="w-1/2">
              <Barcode
                displayValue={false}
                width={1}
                height={50}
                value={data?._id}
              />
              <h1 className="font-semibold">Supplier: {data?.user?.name}</h1>
            </div>
          </div>

          {/* Items table */}
          <div className="items py-2">
            <table className="border w-full">
              <thead className="border">
                <tr>
                  <th className="border py-2">ID</th>
                  <th className="border py-2">Item</th>
                  <th className="border py-2">Price (in &#8377;)</th>
                </tr>
              </thead>

              <tbody>
                {data.items &&
                  data.items.length > 0 &&
                  data.items.map((c: OrderDoc, i: number) => (
                    <tr key={i} className="py-2">
                      <td className="border text-center py-2">{i + 1}</td>
                      <td className="border text-center py-2 capitalize">{c.name}</td>
                      <td className="border text-center py-2">
                        &#8377; {c.price}
                      </td>
                    </tr>
                  ))}
              </tbody>

              <tfoot>
                <tr>
                  <th colSpan={2} className="border capitalize text-center py-2">
                    Total
                  </th>
                  <th className="border capitalize text-center py-2">
                    &#8377;{' '}
                    {data.items &&
                      data.items.length > 0 &&
                      data.items.map((cur: OrderDoc) => cur.price).reduce(
                        (a: any, c: any) => a + c,
                        0
                      )}
                    /-
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer with Generate PDF Button */}
        <footer>
          <button
            className="px-6 py-2 outline-none bg-red-500 rounded-md text-white"
            onClick={() =>
              toPDF({
                method: 'open',
                page: {
                  format: 'A4',
                },
              })
            }
          >
            Generate PDF
          </button>
        </footer>
      </Dialog>
    </>
  );
};

export default ShowAndPrintModel;