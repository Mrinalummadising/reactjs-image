import React, { useState, useEffect } from "react";
import "./App.css";
import { Card, Button, Space } from "antd";
const clientID = `?client_id=${process.env.REACT_APP_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("data", data);
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        (!loading && window.innerHeight + window.scrollY) >=
        document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });

    return () => window.removeEventListener("scroll", event);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="container">
      <Space style={{ marginBottom: 16, marginTop: 10 }}>
        <input
          type="text"
          placeholder="Search Images"
          value={query}
          style={{ width: 300 }}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control"
        />
        <Button type="primary" onClick={handleSubmit}>
          Search
        </Button>
      </Space>
      <div className="row">
        {photos.map((image, index) => (
          <div key={index} className="col-md-4">
            <Card
              cover={
                <img
                  src={image.urls.regular}
                  alt="Image"
                  style={{ height: "150px", objectFit: "cover" }}
                />
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;