import Breadcrumb from '../../breadcrumb/breadcrumb';
import TableMeneProduk from '../../components/tables/TableProdukMene';
import { useNavigate } from 'react-router';
const ProductManagement = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-gray-200 min-h-screen py-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <Breadcrumb pageName="Product Management" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-4">
            <div className="flex justify-between items-center">
              {/* <button className="flex items-center px-4 py-2 bg-[#003D47] bg-opacity-20 text-[#003D47] rounded-md hover:bg-opacity-30">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 15V7H11V15H14L10 19L6 15H9Z" />
                  <path
                    fillRule="evenodd"
                    d="M3 3H17V13H15V5H5V13H3V3Z"
                    clipRule="evenodd"
                  />
                </svg>
                Export
              </button> */}
              <button
               onClick={() => navigate("add")}
               className="flex items-center px-4 py-2 bg-[#003D47] text-white hover:bg-[#4a6265] transition rounded-md">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Tambah Produk
              </button>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <TableMeneProduk />
            </div>
          </div>
        </div>
      </div>
</div>

    </>
  );
};

export default ProductManagement;
