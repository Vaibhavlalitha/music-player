import React, { useState, useEffect } from 'react';
import { Button, Form, InputGroup, Card } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaSearch, FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import './sidebar.css';
import './songs.css'; 

function Songs() {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [playlist, setPlaylist] = useState([]);  
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/items')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items: ', error));

    axios.get('http://localhost:3000/favorities')
      .then(response => setWishlist(response.data))
      .catch(error => {
        console.error('Error fetching Favorities:', error);
        setWishlist([]);
      });

    axios.get('http://localhost:3000/playlist')
      .then(response => setPlaylist(response.data))
      .catch(error => {
        console.error('Error fetching playlist: ', error);
        setPlaylist([]);
      });
  }, []);

  const addToWishlist = async (itemId) => {
    try {
      const selectedItem = items.find((item) => item.id === itemId);
      if (!selectedItem) return;
      const { title, imgUrl, genre, songUrl, singer, id: itemId2 } = selectedItem;

      await axios.post('http://localhost:3000/favorities', { itemId: itemId2, title, imgUrl, genre, songUrl, singer });
      const response = await axios.get('http://localhost:3000/favorities');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error adding to wishlist: ', error);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      const selectedItem = wishlist.find((item) => item.itemId === itemId);
      if (!selectedItem) return;
      await axios.delete(`http://localhost:3000/favorities/${selectedItem.id}`);
      const response = await axios.get('http://localhost:3000/favorities');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error removing from wishlist: ', error);
    }
  };

  const isItemInWishlist = (itemId) => wishlist.some((item) => item.itemId === itemId);

  const addToPlaylist = async (itemId) => {
    try {
      const selectedItem = items.find((item) => item.id === itemId);
      if (!selectedItem) return;
      const { title, imgUrl, genre, songUrl, singer, id: itemId2 } = selectedItem;

      await axios.post('http://localhost:3000/playlist', { itemId: itemId2, title, imgUrl, genre, songUrl, singer });
      const response = await axios.get('http://localhost:3000/playlist');
      setPlaylist(response.data);
    } catch (error) {
      console.error('Error adding to playlist: ', error);
    }
  };

  const removeFromPlaylist = async (itemId) => {
    try {
      const selectedItem = playlist.find((item) => item.itemId === itemId);
      if (!selectedItem) return;
      await axios.delete(`http://localhost:3000/playlist/${selectedItem.id}`);
      const response = await axios.get('http://localhost:3000/playlist');
      setPlaylist(response.data);
    } catch (error) {
      console.error('Error removing from playlist: ', error);
    }
  };

  const isItemInPlaylist = (itemId) => playlist.some((item) => item.itemId === itemId);

  const filteredItems = items.filter((item) =>
    [item.title, item.singer, item.genre].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="songs-container">
      <div className="container p-4">
        <h2 className="page-title">🎵 EXPLORE DOSE</h2>
        <InputGroup className="mb-4 search-bar">
          <InputGroup.Text className="search-icon"><FaSearch /></InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search by singer, genre, or song name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <div className="row">
          {filteredItems.map((item) => (
            <div key={item.id} className="col-md-4">
              <Card className="song-card">
                <Card.Img variant="top" src={item.imgUrl} className="song-img" />
                <Card.Body>
                  <Card.Title className="song-title">{item.title}</Card.Title>
                  <Card.Text className="song-meta">
                    <strong>Genre:</strong> {item.genre} <br />
                    <strong>Singer:</strong> {item.singer}
                  </Card.Text>
                  <audio controls className="audio-player">
                    <source src={item.songUrl} />
                  </audio>
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-light"
                      className="wishlist-btn"
                      onClick={() => isItemInWishlist(item.id) ? removeFromWishlist(item.id) : addToWishlist(item.id)}
                    >
                      {isItemInWishlist(item.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                    </Button>
                    <Button
                      variant="outline-primary"
                      className="playlist-btn"
                      onClick={() => isItemInPlaylist(item.id) ? removeFromPlaylist(item.id) : addToPlaylist(item.id)}
                    >
                      {isItemInPlaylist(item.id) ? <FaMinus /> : <FaPlus />} Playlist
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Songs;
