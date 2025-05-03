// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toast } from '../services/toast';
import { ProgressSpinner } from 'primereact/progressspinner';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/items/products');
      
      // Log da resposta para debug
      console.log('Products response:', response.data);
      
      // Verifica se a resposta tem a propriedade data e se é um array
      const productsData = response.data?.data || response.data || [];
      
      // Garante que products sempre será um array
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setProducts([]);
      toast.error('Erro ao carregar lista de produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const priceTemplate = (rowData) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(rowData.price);
  };

  const emptyTemplate = () => {
    return (
      <div className="empty-message">
        <i className="pi pi-info-circle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
        <p>Nenhum produto encontrado</p>
        <p className="hint-message">Cadastre um novo produto utilizando o formulário ao lado</p>
      </div>
    );
  };

  const loadingTemplate = () => {
    return (
      <div className="loading-container">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration=".5s" />
        <p>Carregando produtos...</p>
      </div>
    );
  };

  return (
    <div className="card products-card">
      <h3>Produtos</h3>
      <DataTable 
        value={products} 
        loading={loading}
        loadingIcon={loadingTemplate}
        emptyMessage={emptyTemplate}
        className="product-table"
        scrollable
        scrollHeight="flex"
      >
        <Column field="title" header="Título" />
        <Column field="description" header="Descrição" />
        <Column field="price" header="Preço" body={priceTemplate} />
      </DataTable>
    </div>
  );
};

export default ProductList;
