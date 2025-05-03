// src/components/ProductForm.jsx
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { toast } from '../services/toast';
import api from '../services/api';

const ProductForm = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validação do título
    if (!title) {
      newErrors.title = 'Título é obrigatório';
    } else if (title.length < 3) {
      newErrors.title = 'Título deve ter no mínimo 3 caracteres';
    } else if (title.length > 20) {
      newErrors.title = 'Título deve ter no máximo 20 caracteres';
    }

    // Validação da descrição
    if (!description) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (description.length < 3) {
      newErrors.description = 'Descrição deve ter no mínimo 3 caracteres';
    } else if (description.length > 20) {
      newErrors.description = 'Descrição deve ter no máximo 20 caracteres';
    }

    // Validação do preço
    if (price === null || price === undefined) {
      newErrors.price = 'Preço é obrigatório';
    } else if (price < 0.01) {
      newErrors.price = 'Preço deve ser maior que R$ 0,01';
    } else if (price > 999999.99) {
      newErrors.price = 'Preço deve ser menor que R$ 999.999,99';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    try {
      setLoading(true);
      await api.post('/items/products', {
        title: title.trim(),
        description: description.trim(),
        price: Number(price)
      });

      toast.success('Produto cadastrado com sucesso!');
      setTitle('');
      setDescription('');
      setPrice(null);
      
      if (onCreate) onCreate();
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar produto';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Dados inválidos';
            break;
          case 401:
            errorMessage = 'Sessão expirada. Faça login novamente';
            break;
          case 403:
            errorMessage = 'Sem permissão para cadastrar produtos';
            break;
          case 429:
            errorMessage = 'Muitas requisições. Tente novamente mais tarde';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
          default:
            errorMessage = error.response.data?.message || 'Erro ao cadastrar produto';
        }
      } else if (error.request) {
        errorMessage = 'Erro de conexão com o servidor';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Cadastrar Produto</h3>
      <div className="p-fluid p-formgrid p-grid form-container">
        <div className="p-field p-col-12 p-mb-2">
          <label htmlFor="title" className="form-label">Título</label>
          <InputText 
            id="title"
            placeholder="Digite o título do produto" 
            value={title} 
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors({...errors, title: null});
            }} 
            className={`p-inputtext-lg ${errors.title ? 'p-invalid' : ''}`}
            required 
            maxLength={20}
          />
          {errors.title && <small className="p-error">{errors.title}</small>}
        </div>
        <div className="p-field p-col-12 p-mb-2">
          <label htmlFor="description" className="form-label">Descrição</label>
          <InputText 
            id="description"
            placeholder="Digite a descrição do produto" 
            value={description} 
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors({...errors, description: null});
            }} 
            className={`p-inputtext-lg ${errors.description ? 'p-invalid' : ''}`}
            required 
            maxLength={20}
          />
          {errors.description && <small className="p-error">{errors.description}</small>}
        </div>
        <div className="p-field p-col-12 p-mb-2">
          <label htmlFor="price" className="form-label">Preço</label>
          <InputNumber 
            id="price"
            placeholder="Digite o preço do produto" 
            value={price} 
            onValueChange={(e) => {
              setPrice(e.value);
              setErrors({...errors, price: null});
            }} 
            mode="currency" 
            currency="BRL" 
            locale="pt-BR"
            className={`p-inputtext-lg ${errors.price ? 'p-invalid' : ''}`}
            required 
            min={0.01}
            max={999999.99}
            minFractionDigits={2}
            maxFractionDigits={2}
          />
          {errors.price && <small className="p-error">{errors.price}</small>}
        </div>
      </div>
      <div className="form-actions">
        <Button 
          label="Cadastrar" 
          icon="pi pi-check" 
          className="p-mt-2"
          loading={loading}
          disabled={loading} 
          type="submit"
        />
      </div>
    </form>
  );
};

export default ProductForm;
