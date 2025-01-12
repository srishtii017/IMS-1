import { Dialog } from 'primereact/dialog';
import { toast } from 'sonner';
import { useGetForSearchUserQuery } from '../../../provider/queries/Users.query';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FaTrashAlt } from "react-icons/fa";
import Loader from '../../../components/Loader';
import moment from 'moment';
import { useCreateOrderMutation } from '../../../provider/queries/Orders.query';
import { useState } from 'react';

interface Item {
    name: string;
    price: string;
}

interface FormErrors {
    user?: string;
    items?: string;
    itemErrors?: Array<{
        name?: string;
        price?: string;
    }>;
}

const AddOrderModel = ({ visible, setVisible }: { visible: boolean; setVisible: (visible: boolean) => void }) => {
    const [CreateOrder] = useCreateOrderMutation();
    const { isLoading, isFetching, data } = useGetForSearchUserQuery({});

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});

    if (isLoading || isFetching) {
        return <Loader />;
    }

    const validateForm = () => {
        const newErrors: FormErrors = {};
        const itemErrors: Array<{ name?: string; price?: string }> = [];
        let hasErrors = false;

        // Validate user
        if (!selectedUser) {
            newErrors.user = "User is required";
            hasErrors = true;
        }

        // Validate items
        if (items.length === 0) {
            newErrors.items = "At least one item is required";
            hasErrors = true;
        }

        // Validate each item
        items.forEach((item, index) => {
            const itemError: { name?: string; price?: string } = {};

            if (!item.name.trim()) {
                itemError.name = "Item name is required";
                hasErrors = true;
            }

            if (!item.price) {
                itemError.price = "Price is required";
                hasErrors = true;
            } else if (isNaN(Number(item.price)) || Number(item.price) <= 0) {
                itemError.price = "Price must be a positive number";
                hasErrors = true;
            }

            itemErrors[index] = itemError;
        });

        if (itemErrors.length > 0) {
            newErrors.itemErrors = itemErrors;
        }

        setErrors(newErrors);
        return !hasErrors;
    };

    const handleAddItem = () => {
        setItems([...items, { name: '', price: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: keyof Item, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const selectedCountryTemplate = (option: any) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div className="capitalize">
                        {option.name} - {moment(new Date(option.dob)).format("L")}
                    </div>
                </div>
            );
        }
        return <span>Select a User</span>;
    };

    const countryOptionTemplate = (option: any) => {
        return (
            <div className="flex align-items-center">
                <img
                    alt={option.name}
                    src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
                    className={`mr-2 flag`}
                    style={{ width: '18px' }}
                />
                <div>
                    {option.name} - {moment(new Date(option.dob)).format("L")}
                </div>
            </div>
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const formData = {
                user: selectedUser._id,
                items: items.map(item => ({
                    ...item,
                    price: Number(item.price)
                }))
            };

            const { data: responseData, error }: any = await CreateOrder(formData);

            if (error) {
                toast.error(error.data.message);
                return;
            }

            toast.success(responseData.msg);
            setItems([]);
            setSelectedUser(null);
            setErrors({});
            setVisible(false);
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    return (
        <Dialog
            draggable={false}
            header="Add Order"
            position="top"
            visible={visible}
            className="w-full md:w-[70%] lg:w-[60%]"
            onHide={() => setVisible(false)}
        >
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-3">
                    <label htmlFor="user">User <span className="text-red-500 text-sm">*</span></label>
                    <Dropdown
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.value)}
                        filterBy="name"
                        options={data?.users || []}
                        filterPlaceholder="Search User By Name"
                        optionLabel="name"
                        placeholder="Select a User"
                        emptyFilterMessage="No User Found"
                        emptyMessage="You Have No User"
                        filter
                        valueTemplate={selectedCountryTemplate}
                        itemTemplate={countryOptionTemplate}
                        className="w-full my-2 border outline-none ring-0"
                    />
                    {errors.user && <p className="text-red-500 capitalize">{errors.user}</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="items">Items <span className="text-red-500 text-sm">*</span></label>
                    <div className="mb-3 flex justify-end">
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="bg-purple-500 px-4 text-white py-2 rounded-md"
                        >
                            Add +
                        </button>
                    </div>

                    {items.map((item, index) => (
                        <div className="w-full flex items-center justify-between gap-x-4" key={index}>
                            <div className="w-1/2">
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                    className="w-full my-2 border outline-none py-3 px-4"
                                    placeholder="Item Name"
                                />
                                {errors.itemErrors?.[index]?.name && (
                                    <p className="text-red-500 capitalize">{errors.itemErrors[index].name}</p>
                                )}
                            </div>
                            <div className="w-1/2">
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                    className="w-full my-2 border outline-none py-3 px-4"
                                    placeholder="Item Price"
                                    min="0"
                                    step="0.01"
                                />
                                {errors.itemErrors?.[index]?.price && (
                                    <p className="text-red-500 capitalize">{errors.itemErrors[index].price}</p>
                                )}
                            </div>
                            <div>
                                <button
                                    onClick={() => handleRemoveItem(index)}
                                    type="button"
                                    className="px-3 py-3 rounded-full bg-black text-white"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                    {errors.items && <p className="text-red-500 capitalize">{errors.items}</p>}
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        className="text-white px-5 rounded-sm bg-indigo-500 py-3 text-center"
                    >
                        Add Order
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};

export default AddOrderModel;