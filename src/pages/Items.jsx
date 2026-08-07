import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import AdminSidebar from "../components/AdminSidebar";

const API = "https://code6technologies.com/catalogproapi";

function Items() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [removeImage, setRemoveImage] = useState(false);

  const [form, setForm] = useState({
    category_id: "",
    item_type: "product",
    name: "",
    slug: "",
    short_description: "",
    description: "",
    price: "",
    sale_price: "",
    sort_order: 0,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
const [imagePreview, setImagePreview] = useState("");
const [uploadingImage, setUploadingImage] = useState(false);

  const getToken = () => {
    return localStorage.getItem("catalogpro_token");
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [itemsResponse, categoriesResponse] =
        await Promise.all([
          fetch(`${API}/items/list.php`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API}/categories/list.php`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const itemsResult =
        await itemsResponse.json();

      const categoriesResult =
        await categoriesResponse.json();

      console.log("Items:", itemsResult);
      console.log(
        "Categories:",
        categoriesResult
      );

      if (!itemsResult.success) {
        setError(
          itemsResult.message ||
            "Failed to load items"
        );
        return;
      }

      if (!categoriesResult.success) {
        setError(
          categoriesResult.message ||
            "Failed to load categories"
        );
        return;
      }

      setItems(
        itemsResult.data.items || []
      );

      setCategories(
        categoriesResult.data.categories || []
      );

    } catch (err) {
      console.error(err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };



  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;

    setForm((prev) => ({
      ...prev,
      name,
      slug: editingId
        ? prev.slug
        : generateSlug(name),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      category_id: "",
      item_type: "product",
      name: "",
      slug: "",
      short_description: "",
      description: "",
      price: "",
      sale_price: "",
      sort_order: items.length,
    });

     setSelectedImage(null);
  setImagePreview("");

    setRemoveImage(false);


    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setMessage("");
    setError("");

    setEditingId(null);
      setRemoveImage(false);


    setForm({
      category_id:
        categories.length > 0
          ? categories[0].id
          : "",
      item_type: "product",
      name: "",
      slug: "",
      short_description: "",
      description: "",
      price: "",
      sale_price: "",
      sort_order: items.length,
    });

    setSelectedImage(null);
setImagePreview("");

    setShowForm(true);
  };

const openEditForm = (item) => {
  setMessage("");
  setError("");

  setEditingId(item.id);
  setRemoveImage(false);
  setSelectedImage(null);

  setForm({
    category_id: item.category_id || "",
    item_type: item.item_type || "product",
    name: item.name || "",
    slug: item.slug || "",
    short_description: item.short_description || "",
    description: item.description || "",
    price: item.price || "",
    sale_price: item.sale_price || "",
    sort_order: item.sort_order ?? 0,
  });

  setImagePreview(
    item.image
      ? `https://code6technologies.com/catalogproapi/${item.image}`
      : ""
  );

  setShowForm(true);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    if (!form.category_id) {
      setError("Please select a category.");
      return;
    }

    if (!form.name.trim()) {
      setError("Item name is required.");
      return;
    }

    try {
      setMessage("");
      setError("");

      const isEditing = Boolean(editingId);

      const endpoint = isEditing
        ? `${API}/items/update.php`
        : `${API}/items/create.php`;

      const body = isEditing
        ? {
            id: editingId,
            category_id:
              Number(form.category_id),
            item_type: form.item_type,
            name: form.name,
            slug: form.slug,
            short_description:
              form.short_description,
            description:
              form.description,
            price:
              Number(form.price) || 0,
            sale_price:
              Number(form.sale_price) || 0,
            sort_order:
              Number(form.sort_order) || 0,
              remove_image: removeImage,
          }
        : {
            category_id:
              Number(form.category_id),
            item_type: form.item_type,
            name: form.name,
            slug: form.slug,
            short_description:
              form.short_description,
            description:
              form.description,
            price:
              Number(form.price) || 0,
            sale_price:
              Number(form.sale_price) || 0,
            sort_order:
              Number(form.sort_order) || 0,
          };

      const response = await fetch(
        endpoint,
        {
          method: isEditing
            ? "PUT"
            : "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result =
        await response.json();

      console.log(
        "Item save:",
        result
      );

      if (!result.success) {
        setError(
          result.message ||
            "Item save failed"
        );
        return;
      }
const savedItemId =
  result.data?.id || editingId;

console.log(
  "========== IMAGE DEBUG =========="
);

console.log(
  "Saved Item ID:",
  savedItemId
);

console.log(
  "Selected Image:",
  selectedImage
);

if (selectedImage && savedItemId) {

  const uploadResult =
    await uploadItemImage(savedItemId);

  console.log(
    "Image Upload Result:",
    uploadResult
  );

  if (!uploadResult) {
    setError(
      "Item saved, but image upload failed."
    );
    return;
  }
}

setMessage(
  isEditing
    ? "Item updated successfully."
    : "Item created successfully."
);

resetForm();

await loadData();

    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to server."
      );
    }
  };

const handleImageChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    setError("Please select a valid image.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setError("Image size must be less than 5 MB.");
    return;
  }

  setSelectedImage(file);
  setImagePreview(URL.createObjectURL(file));

  setRemoveImage(false);
  setError("");
};


const uploadItemImage = async (itemId) => {
  if (!selectedImage) {
    return true;
  }

  const token = getToken();

  if (!token) {
    navigate("/login");
    return false;
  }

  console.log("Uploading image for item:", itemId);
  console.log(
    "File:",
    selectedImage.name,
    selectedImage.size,
    selectedImage.type
  );

  const formData = new FormData();

  formData.append("item_id", String(itemId));
  formData.append("image", selectedImage);

  try {
    setUploadingImage(true);

    const response = await fetch(
      `${API}/items/upload-image.php`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    console.log(
      "Upload HTTP Status:",
      response.status
    );

    const result = await response.json();

    console.log(
      "UPLOAD API RESPONSE:",
      result
    );

    if (!response.ok || !result.success) {
      setError(
        result.message ||
          "Image upload failed."
      );

      return false;
    }

    console.log(
      "Image uploaded successfully:",
      result.data
    );

    return true;

  } catch (err) {
    console.error(
      "Image upload error:",
      err
    );

    setError(
      "Unable to upload image."
    );

    return false;

  } finally {
    setUploadingImage(false);
  }
};

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this item?"
      );

    if (!confirmDelete) {
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API}/items/delete.php`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "Delete item:",
        result
      );

      if (!result.success) {
        setError(
          result.message ||
            "Delete failed"
        );
        return;
      }

      setMessage(
        "Item deleted successfully."
      );

      await loadData();

    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to server."
      );
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Items...
      </div>
    );
  }

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

<AdminSidebar />


      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <h1>Items</h1>

            <p>
              Manage your catalogue products,
              services and packages
            </p>
          </div>

          <button
            className="category-add-button"
            onClick={openAddForm}
          >
            + Add Item
          </button>

        </header>


        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}


        {/* FORM */}

        {showForm && (
          <section className="item-form-card">

            <div className="category-form-header">

              <div>
                <h2>
                  {editingId
                    ? "Edit Item"
                    : "Add Item"}
                </h2>

                <p>
                  Add products, services or
                  packages to your catalogue.
                </p>
              </div>

              <button
                className="category-close-button"
                onClick={resetForm}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="item-form-grid">

{/* IMAGE */}

<div className="category-field item-image-field">

  <label>
    Item Image
  </label>

  <div className="item-upload-box">

    {imagePreview ? (
      <div className="item-image-preview">

        <img
          src={imagePreview}
          alt="Preview"
        />

        <button
          type="button"
          className="item-remove-image"
          onClick={() => {
  setSelectedImage(null);
  setImagePreview("");
  setRemoveImage(true);
}}
        >
          Remove
        </button>

      </div>
    ) : (
      <label className="item-upload-label">

        <span className="item-upload-icon">
          +
        </span>

        <span>
          Select Image
        </span>

        <small>
          JPG, PNG or WEBP • Max 5MB
        </small>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={
            handleImageChange
          }
        />

      </label>
    )}

  </div>

</div>

                {/* CATEGORY */}

                <div className="category-field">

                  <label>
                    Category
                  </label>

                  <select
                    name="category_id"
                    value={
                      form.category_id
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >

                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}

                  </select>

                </div>


                {/* TYPE */}

                <div className="category-field">

                  <label>
                    Item Type
                  </label>

                  <select
                    name="item_type"
                    value={
                      form.item_type
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="product">
                      Product
                    </option>

                    <option value="service">
                      Service
                    </option>

                    <option value="package">
                      Package
                    </option>

                  </select>

                </div>


                {/* NAME */}

                <div className="category-field item-name-field">

                  <label>
                    Item Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={
                      handleNameChange
                    }
                    placeholder="Example: Premium Sofa"
                    required
                  />

                </div>


                {/* SLUG */}

                <div className="category-field">

                  <label>
                    Slug
                  </label>

                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={
                      handleChange
                    }
                    placeholder="premium-sofa"
                    required
                  />

                </div>


                {/* SHORT DESCRIPTION */}

                <div className="category-field item-full-field">

                  <label>
                    Short Description
                  </label>

                  <input
                    type="text"
                    name="short_description"
                    value={
                      form.short_description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Short description"
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="category-field item-full-field">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter detailed description..."
                    rows="5"
                  />

                </div>


                {/* PRICE */}

                <div className="category-field">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={
                      handleChange
                    }
                    placeholder="5000"
                    min="0"
                  />

                </div>


                {/* SALE PRICE */}

                <div className="category-field">

                  <label>
                    Sale Price
                  </label>

                  <input
                    type="number"
                    name="sale_price"
                    value={
                      form.sale_price
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="4499"
                    min="0"
                  />

                </div>


                {/* SORT ORDER */}

                <div className="category-field">

                  <label>
                    Sort Order
                  </label>

                  <input
                    type="number"
                    name="sort_order"
                    value={
                      form.sort_order
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                  />

                </div>

              </div>


              <div className="category-form-actions">

                <button
                  type="button"
                  className="category-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
  type="submit"
  className="category-save-button"
  disabled={uploadingImage}
>
  {uploadingImage
    ? "Uploading..."
    : editingId
      ? "Update Item"
      : "Create Item"}
</button>

              </div>

            </form>

          </section>
        )}


        {/* ITEMS */}

{/* ITEMS */}

<section className="item-table-card">

  {/* HEADER */}

  <div className="category-table-header">

    <div>

      <h2>
        All Items
      </h2>

      <span>
        {items.length}{" "}
        {items.length === 1
          ? "item"
          : "items"}
      </span>

    </div>

  </div>


  {/* EMPTY */}

  {items.length === 0 ? (

    <div className="category-empty">

      <div className="category-empty-icon">
        ▣
      </div>

      <h3>
        No items yet
      </h3>

      <p>
        Add your first product,
        service or package.
      </p>

      <button
        className="category-add-button"
        onClick={openAddForm}
      >
        + Add Item
      </button>

    </div>

  ) : (

    <>

      {/* DESKTOP TABLE */}

      <div className="category-table-wrapper">

        <table className="category-table">

          <thead>

            <tr>

              <th>#</th>

              <th>Item</th>

              <th>Category</th>

              <th>Type</th>

              <th>Price</th>

              <th>Sale Price</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>


          <tbody>

            {items.map(
              (item, index) => (

                <tr key={item.id}>

                  <td>
                    {index + 1}
                  </td>


                  <td>

                    <div className="item-name-cell">

                      <div className="category-icon">

                        {item.image ? (

                          <img
                            src={`https://code6technologies.com/catalogproapi/${item.image}`}
                            alt={item.name}
                            className="item-list-image"
                          />

                        ) : (

                          item.name
                            ?.charAt(0)
                            .toUpperCase()

                        )}

                      </div>


                      <div>

                        <strong>
                          {item.name}
                        </strong>

                        <small>
                          {item.slug}
                        </small>

                      </div>

                    </div>

                  </td>


                  <td>

                    <span className="item-category-badge">

                      {item.category?.name ||
                        item.category_name ||
                        "—"}

                    </span>

                  </td>


                  <td>

                    <span className="item-type-badge">

                      {item.item_type}

                    </span>

                  </td>


                  <td>

                    <span className="item-price">

                      ₹
                      {Number(
                        item.price || 0
                      ).toLocaleString("en-IN")}

                    </span>

                  </td>


                  <td>

                    <span className="item-sale-price">

                      ₹
                      {Number(
                        item.sale_price || 0
                      ).toLocaleString("en-IN")}

                    </span>

                  </td>


                  <td>

                    <span className="category-status">
                      Active
                    </span>

                  </td>


                  <td>

                    <div className="category-actions">

                      <button
                        type="button"
                        className="category-edit-button"
                        onClick={() =>
                          openEditForm(item)
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="category-delete-button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>


      {/* MOBILE CARDS */}

      <div className="item-mobile-list">

        {items.map(
          (item, index) => (

            <div
              className="item-mobile-card"
              key={item.id}
            >

              {/* CARD HEADER */}

              <div className="item-mobile-top">

                <div className="item-mobile-info">

                  <div className="item-mobile-image">

                    {item.image ? (

                      <img
                        src={`https://code6technologies.com/catalogproapi/${item.image}`}
                        alt={item.name}
                      />

                    ) : (

                      <span>
                        {item.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </span>

                    )}

                  </div>


                  <div className="item-mobile-title">

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      /{item.slug}
                    </span>

                  </div>

                </div>


                <span className="item-mobile-status">
                  Active
                </span>

              </div>


              {/* CATEGORY + TYPE */}

              <div className="item-mobile-details">

                <div>

                  <small>
                    Category
                  </small>

                  <strong>
                    {item.category?.name ||
                      item.category_name ||
                      "—"}
                  </strong>

                </div>


                <div>

                  <small>
                    Type
                  </small>

                  <strong className="item-mobile-type">
                    {item.item_type}
                  </strong>

                </div>

              </div>


              {/* PRICE */}

              <div className="item-mobile-prices">

                <div>

                  <small>
                    Price
                  </small>

                  <strong>
                    ₹
                    {Number(
                      item.price || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>


                <div>

                  <small>
                    Sale Price
                  </small>

                  <strong className="item-mobile-sale-price">

                    ₹
                    {Number(
                      item.sale_price || 0
                    ).toLocaleString("en-IN")}

                  </strong>

                </div>

              </div>


              {/* NUMBER */}

              <div className="item-mobile-number">

                <span>
                  #
                </span>

                <strong>
                  {index + 1}
                </strong>

              </div>


              {/* ACTIONS */}

              <div className="item-mobile-actions">

                <button
                  type="button"
                  className="category-edit-button"
                  onClick={() =>
                    openEditForm(item)
                  }
                >
                  Edit
                </button>


                <button
                  type="button"
                  className="category-delete-button"
                  onClick={() =>
                    handleDelete(item.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          )
        )}

      </div>

    </>

  )}

</section>
      </main>

    </div>
  );
}

export default Items;