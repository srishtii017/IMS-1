import React from 'react';

const Invoice = () => {
  const invoices = [
    { id: 1, number: 'INV001', date: '2024-11-10', amount: '$100', status: 'Paid' },
    { id: 2, number: 'INV002', date: '2024-11-11', amount: '$250', status: 'Pending' },
    { id: 3, number: 'INV003', date: '2024-11-12', amount: '$320', status: 'Paid' },
  ];

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Invoices</h1>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-200 text-xs text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">Invoice Number</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b">
                <td className="px-6 py-4">{invoice.number}</td>
                <td className="px-6 py-4">{invoice.date}</td>
                <td className="px-6 py-4">{invoice.amount}</td>
                <td className="px-6 py-4">{invoice.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoice;