"use client";
import { useState, useEffect } from "react";
import useModal from "@/app/ui/hooks/useModal";

const AdminNewsViewPage = () => {
  const [articles, setArticles] = useState<
    { id: number; title: string; content: string; image_url: string | null }[]
  >([]);
  const { isOpen, openModal, closeModal, selectedItem, maxHeight } = useModal();
  const [isEditing, setIsEditing] = useState(false);
  const [editArticle, setEditArticle] = useState<{
    id: number;
    title: string;
    content: string;
    image_url: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete article");
      }
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  const handleEdit = (article: {
    id: number;
    title: string;
    content: string;
    image_url: string | null;
  }) => {
    setIsEditing(true);
    setEditArticle(article);
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editArticle) return;

    const { title, content, image_url } = editArticle;
    if (!title || !content) {
      alert("Le titre et le contenu sont requis");
      return;
    }

    const updatedArticle = {
      ...editArticle,
      image_url: image_url || null,
    };

    try {
      const response = await fetch(`/api/articles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedArticle),
      });

      if (!response.ok) {
        throw new Error(`Failed to update article: ${response.statusText}`);
      }

      setArticles(
        articles.map((article) =>
          article.id === updatedArticle.id ? updatedArticle : article,
        ),
      );
      setIsEditing(false);
      closeModal();
    } catch (error) {
      console.error("Failed to update article:", error);
      alert("Erreur lors de la mise à jour de l'article.");
    }
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => <p key={index}>{line}</p>);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">View and Edit News</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="block p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openModal(article)}
          >
            <h2 className="text-xl font-bold mb-2">{article.title}</h2>
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="mb-4 w-full h-48 object-cover rounded-lg"
              />
            )}
            <p>
              {article.content.length > 150
                ? article.content.substring(0, 150) + "..."
                : article.content}
            </p>
          </div>
        ))}
      </div>

      {isOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-black text-3xl font-bold hover:text-gray-600"
              onClick={closeModal}
              style={{ zIndex: 1000 }}
            >
              ×
            </button>
            {isEditing ? (
              <form onSubmit={handleEditSubmit}>
                <h2 className="text-2xl font-bold mb-2">Edit Article</h2>
                <input
                  type="text"
                  value={editArticle?.title || ""}
                  onChange={(e) =>
                    setEditArticle({ ...editArticle!, title: e.target.value })
                  }
                  className="w-full mb-4 p-2 border rounded-lg"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={editArticle?.image_url || ""}
                  onChange={(e) =>
                    setEditArticle({
                      ...editArticle!,
                      image_url: e.target.value,
                    })
                  }
                  className="w-full mb-4 p-2 border rounded-lg"
                  placeholder="Image URL"
                />
                <textarea
                  value={editArticle?.content || ""}
                  onChange={(e) =>
                    setEditArticle({ ...editArticle!, content: e.target.value })
                  }
                  className="w-full mb-4 p-2 border rounded-lg"
                  placeholder="Content"
                  rows={10}
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedItem.title}
                </h2>
                {selectedItem.image_url && (
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    className="mb-4 w-full h-64 object-cover rounded-lg"
                  />
                )}
                <div className="text-lg space-y-4">
                  {formatContent(selectedItem.content)}
                </div>
                <button
                  onClick={() => handleEdit(selectedItem)}
                  className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedItem.id)}
                  className="mt-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsViewPage;
