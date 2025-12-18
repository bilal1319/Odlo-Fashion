import React, { useState } from "react";
import { servicesData } from "../data/servicesData";

const ServicesManagement = () => {
  const initialServices = Object.keys(servicesData)
    .flatMap((categoryKey) =>
      servicesData[categoryKey].map((s) => ({
        ...s,
        price: Number(s.price.replace("$", "")),
        category: categoryKey,
        status: "active",
      }))
    );

  const [services, setServices] = useState(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.useCase?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const openModal = (service = null) => {
    setModalData(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalData(null);
    setIsModalOpen(false);
  };

  const handleSaveService = (serviceData) => {
    if (serviceData.id) {
      setServices((prev) =>
        prev.map((s) => (s.id === serviceData.id ? { ...serviceData } : s))
      );
    } else {
      const newService = {
        ...serviceData,
        id: Date.now(),
        price: Number(serviceData.price),
        status: "active",
      };
      setServices((prev) => [newService, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this service?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Services Management</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          {Object.keys(servicesData).map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>

        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          + Add Service
        </button>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Price ($)</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Use Case</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{service.title}</td>
                <td className="px-4 py-2 border">{service.price}</td>
                <td className="px-4 py-2 border">
                  {service.category
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </td>
                <td className="px-4 py-2 border">{service.useCase}</td>
                <td className="px-4 py-2 border flex gap-2">
                  <button
                    onClick={() => openModal(service)}
                    className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredServices.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">
              {modalData ? "Edit Service" : "Create Service"}
            </h2>
            <ServiceForm
              service={modalData}
              onSave={handleSaveService}
              onClose={closeModal}
              categories={Object.keys(servicesData)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ServiceForm = ({ service, onSave, onClose, categories }) => {
  const [formData, setFormData] = useState(
    service || {
      title: "",
      price: "",
      description: "",
      useCase: "",
      category: categories[0],
      image: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </option>
        ))}
      </select>
      <input
        name="useCase"
        placeholder="Use Case"
        value={formData.useCase}
        onChange={handleChange}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded border hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ServicesManagement;
