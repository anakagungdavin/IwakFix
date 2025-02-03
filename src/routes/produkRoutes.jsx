import ProductManagement from "../pages/productmanage/ProductManagement";
import AddProduct from "../pages/productmanage/AddProduct";
import Breadcrumb from "../breadcrumb/breadcrumb";

const ProdukRoutes = [
    {
        path: 'produk-menejemen',
        element: <ProductManagement Breadcrumb={Breadcrumb.ProductManagement.index}/>
    },
    {
        path: 'produk-add',
        element: <AddProduct Breadcrumb={Breadcrumb.AddProduct.index}/>
    }
]
export default ProdukRoutes