// services/socketIntegrationService.js
import useProductsStore from '../store/productsStore';
import useAdminProductsStore from '../store/adminProductsStore';
import { getIO } from '../utils/socketClient';

export const setupSocketListeners = () => {
  const socket = getIO();
  
  if (!socket) return;
  
  // Listen for product changes from any source
  socket.on('product:changed', async () => {
    console.log('Product changed via socket, refreshing...');
    
    // Refresh products in main store
    const productsStore = useProductsStore.getState();
    await productsStore.getAllProducts();
    
    // Also refresh admin products if needed
    const adminStore = useAdminProductsStore.getState();
    if (adminStore.adminProducts.length > 0) {
      await adminStore.getAdminProducts();
    }
  });
  
  socket.on('product:deleted', async (data) => {
    console.log('Product deleted via socket:', data);
    
    // Update main store
    const productsStore = useProductsStore.getState();
    const updatedProducts = productsStore.products.filter(p => p._id !== data.id);
    useProductsStore.setState({ products: updatedProducts });
    
    // Update admin store
    const adminStore = useAdminProductsStore.getState();
    const updatedAdminProducts = adminStore.adminProducts.filter(p => p._id !== data.id);
    useAdminProductsStore.setState({ adminProducts: updatedAdminProducts });
  });
  
  socket.on('admin:product:created', (newProduct) => {
    console.log('Admin created product via socket:', newProduct);
    
    // Update both stores
    const productsStore = useProductsStore.getState();
    useProductsStore.setState({
      products: [newProduct, ...productsStore.products]
    });
    
    const adminStore = useAdminProductsStore.getState();
    useAdminProductsStore.setState({
      adminProducts: [newProduct, ...adminStore.adminProducts]
    });
  });
  
  socket.on('admin:product:updated', (updatedProduct) => {
    console.log('Admin updated product via socket:', updatedProduct);
    
    // Update both stores
    const productsStore = useProductsStore.getState();
    const updatedProducts = productsStore.products.map(p =>
      p._id === updatedProduct._id ? updatedProduct : p
    );
    useProductsStore.setState({ products: updatedProducts });
    
    const adminStore = useAdminProductsStore.getState();
    const updatedAdminProducts = adminStore.adminProducts.map(p =>
      p._id === updatedProduct._id ? updatedProduct : p
    );
    useAdminProductsStore.setState({ adminProducts: updatedAdminProducts });
  });
  
  socket.on('admin:product:deleted', (data) => {
    console.log('Admin deleted product via socket:', data);
    
    // Update both stores
    const productsStore = useProductsStore.getState();
    const updatedProducts = productsStore.products.filter(p => p._id !== data.id);
    useProductsStore.setState({ products: updatedProducts });
    
    const adminStore = useAdminProductsStore.getState();
    const updatedAdminProducts = adminStore.adminProducts.filter(p => p._id !== data.id);
    useAdminProductsStore.setState({ adminProducts: updatedAdminProducts });
  });
  
  socket.on('admin:product:toggled', (data) => {
    console.log('Product status toggled via socket:', data);
    
    // Update both stores
    const productsStore = useProductsStore.getState();
    const updatedProducts = productsStore.products.map(p =>
      p._id === data._id ? { ...p, isActive: data.isActive } : p
    );
    useProductsStore.setState({ products: updatedProducts });
    
    const adminStore = useAdminProductsStore.getState();
    const updatedAdminProducts = adminStore.adminProducts.map(p =>
      p._id === data._id ? { ...p, isActive: data.isActive } : p
    );
    useAdminProductsStore.setState({ adminProducts: updatedAdminProducts });
  });
};