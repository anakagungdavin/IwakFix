import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import { getStatus } from "../../pages/productmanage/AddProduct";
import DeleteModal from "../modal/modalDelete";
import Products from "../../dummyData/daftarProduk";
import ModalView from "../modal/modalViewProduk";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../../services/api';

// const packageData = [
//     {
//       name: 'Iwak Bandeng',
//       price: 0.0,
//       id: 1234,
//       stok: '10',
//       status: 'Published',
//     },
//     {
//       name: 'Iwak Gurame',
//       price: 59.0,
//       id: 54312,
//       stok: '90',
//       status: 'Low Stock',
//     },
//   ];
  // const packageData = [
  //   {
  //     name: 'Iwak Bandeng',
  //     price: 0.0,
  //     id: 1234,
  //     stok: '10',
  //     isPublished: true,
  //   },
  //   {
  //     name: 'Iwak Gurame',
  //     price: 59.0,
  //     id: 54312,
  //     stok: '90',
  //     isPublished: true,
  //   },
  //   {
  //     name: 'Iwak Nila',
  //     price: 25.0,
  //     id: 6789,
  //     stok: 5,
  //     isPublished: true,
  //   },
  //   {
  //     name: 'Iwak Lele',
  //     price: 12.0,
  //     id: 1111,
  //     stok: 0,
  //     isPublished: true,
  //   },
  //   {
  //     name: 'Iwak Mujair',
  //     price: 8.0,
  //     id: 2222,
  //     stok: 15,
  //     isPublished: false,
  //   },
  // ];

  // const formattedPackageData = packageData.map((item) => ({
  //   ...item,
  //   status: getStatus(item.stok, item.isPublished),
  // }));
  const formattedPackageData = Products.map((item) => {
    const statusData = getStatus(item.stok, item.isPublished);
    return { ...item, status: statusData.label, statusColor: statusData.color };
  });

  
  const TableMeneProduk = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(null);

    // useEffect(() => {
    //   const fetchProducts = async () => {
    //     try {
    //       const products = await getProducts();
    //       const formattedProducts = products.map((item) => {
    //         const statusData = getStatus(item.stock, item.isPublished);
    //         return { ...item, status: statusData.label, statusColor: statusData.color };
    //       });
    //       setData(formattedProducts);
    //     }catch(error){
    //       console.error("error fetching product:", error);
    //     }
    //   };
    //   fetchProducts();
    // }, []);
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          // Destructure respons agar mendapatkan properti products
          const { products } = await getProducts();
          const formattedProducts = products.map((item) => {
            const statusData = getStatus(item.stock, item.isPublished);
            return { ...item, status: statusData.label, statusColor: statusData.color };
          });
          setData(formattedProducts);
        } catch (error) {
          console.error("error fetching product:", error);
        }
      };
      fetchProducts();
    }, []);

    const handleDeleteClick = (item) => {
      setSelectedItem(item);
      setIsModalOpen(true);
    }
    // const confirmDelete = () => {
    //   setData(data.filter(item => item.id !== selectedItem.id));
    //   setIsModalOpen(false);
    // }
    const confirmDelete = async () => {
      try {
        await deleteProduct(selectedItem.id);
        setData(data.filter(item => item.id !== selectedItem.id));
        setIsModalOpen(false);
      } catch (error) {
        console.error("error deleting product:", error);
      }
    }
    const handleViewDetails = (item) => {
      console.log("Item yang dipilih:", item);
      setSelectedItem(item);
      setIsViewOpen(true);
    }

    const handleEditClick = (id) => {
      navigate(`/product-management/edit/${id}`);
    };
    

    return (
      <div className="rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }} className="text-left dark:bg-gray-700">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Produk
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  ID
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Stok
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {packageData.map((packageItem, key) => ( */}
              {/* {formattedPackageData.map((packageItem, key) => ( */}
              {data.map((packageItem, key) => (
                  <tr key={key}>
                  {/* Kolom Nama & Harga */}
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                      {packageItem.name}
                      </h5>
                      <p className="text-sm">${packageItem.price}</p>
                  </td>
  
                  {/* Kolom ID */}
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {packageItem._id}
                  </td>
  
                  {/* Kolom Stok */}
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {packageItem.stock}
                  </td>
  
                  {/* Kolom Status */}
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
                        packageItem.status === 'Published'
                        ? 'bg-[#E9FAF7] text-[#1A9882]' // Published
                        : packageItem.status === 'Low Stock'
                        ? 'bg-[#FFF0EA] text-[#F86624]' // Low Stock
                        : packageItem.status === 'Out of Stock'
                        ? 'bg-[#FEECEE] text-[#EB3D4D]' // Out of Stock
                        : packageItem.status === 'Draft'
                        ? 'bg-[#F0F1F3] text-[#667085]' // Draft
                        : ''
                      }`}
                    >
                      {packageItem.status}
                    </p>
                  </td>
  
                 
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button 
                      onClick={() => handleViewDetails(packageItem)}
                      className="hover:text-primary">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteClick(packageItem)}
                      className="hover:text-primary">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                        </svg>
                      </button>
                      <button 
                      onClick={() => handleEditClick(packageItem._id)}
                      className="hover:text-primary">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.8093 1.73438L15.6968 4.62188L6.31805 14.0006L3.4043 14.2412C2.9293 14.2844 2.52805 13.9125 2.4843 13.4375L2.24368 10.5238L12.8093 1.73438ZM16.6687 3.65L14.9906 1.97188C14.5687 1.55 13.875 1.55 13.4531 1.97188L11.9812 3.44375L14.8687 6.33125L16.3406 4.85938C16.7625 4.4375 16.7625 3.74375 16.6687 3.65ZM1.5 15.375C1.5 15.6813 1.74375 15.925 2.05 15.925H15.95C16.2563 15.925 16.5 15.6813 16.5 15.375C16.5 15.0688 16.2563 14.825 15.95 14.825H2.05C1.74375 14.825 1.5 15.0688 1.5 15.375Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          item={selectedItem}
          />
        )}
        {
          isViewOpen && selectedItem &&(
            <ModalView
            isOpen={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            item = {selectedItem}
            />
          )
        }
      </div>
    );
  };
  
  export default TableMeneProduk;
  