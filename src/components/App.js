import { useState, useEffect } from "react";
import api from "../utils/Api.js";
import Header from "./Header.jsx";
import Main from "./Main.jsx";
import Footer from "./Footer.jsx";
import ImagePopup from "./ImagePopup.jsx";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteConfirmPopup from "./DeleteConfirmPopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
function App() {
  const [isEditProfilePopupOpen, changeProfilePopupOpen] = useState(false);
  function onEditProfile() {
    changeProfilePopupOpen(true);
  }
  const [isAddPlacePopupOpen, changePlacePopupOpen] = useState(false);
  function onAddPlace() {
    changePlacePopupOpen(true);
  }
  const [isEditAvatarPopupOpen, changeAvatarPopupOpen] = useState(false);
  function onEditAvatar() {
    changeAvatarPopupOpen(true);
  }
  const [isDeletePopupOpen, changeDeletePopupOpen] = useState(false);

  const [isLoading, changeIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [cardForDelete, setCardForDelete] = useState({});
  const [selectedCard, setSelectedCard] = useState({
    isImageOpen: false,
    name: "",
    link: "",
  });

  function handleAddCard(newCard) {
    changeIsLoading(true);
    api
      .addCard(newCard)
      .then((cardInfo) => {
        setCards([cardInfo, ...cards]);
      })
      .catch((err) => {
        console.log(`Ошибка:${err}`);
      })
      .finally(() => {
        closeAllPopups();
        changeIsLoading(false);
      });
  }

  function handleUpdateAvatar(avatar) {
    changeIsLoading(true);
    api
      .changeAvatar(avatar)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
      })
      .catch((err) => {
        console.log(`Ошибка:${err}`);
      })
      .finally(() => {
        closeAllPopups();
        changeIsLoading(false);
      });
  }

  function handleUpdateUser(userInfo) {
    changeIsLoading(true);
    api
      .setUserInfo(userInfo)
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((err) => {
        console.log(`Ошибка:${err}`);
      })
      .finally(() => {
        closeAllPopups();
        changeIsLoading(false);
      });
  }

  function handleCardClick(card) {
    const cardName = card.name;
    const cardLink = card.link;
    setSelectedCard({
      isImageOpen: true,
      name: cardName,
      link: cardLink,
    });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => {
        console.log(`Ошибка:${err}`);
      });
  }

  function handleCardDelete(card) {
    changeDeletePopupOpen(true);
    setCardForDelete(card);
  }

  function handleConfurm() {
    changeIsLoading(true);
    api
      .deleteCard(cardForDelete._id)
      .then(() => {
        const newCards = cards.filter((i) => i._id !== cardForDelete._id);
        setCards(newCards);
      })
      .catch((err) => {
        console.log(`Ошибка:${err}`);
      })
      .finally(() => {
        closeAllPopups();
        changeIsLoading(false);
      });
  }

  useEffect(() => {
    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.log(`Ошибка:${err}`);
      });
  }, []);
  useEffect(() => {
    api
      .getInitialCards()
      .then((cardData) => {
        setCards(cardData);
      })
      .catch((err) => {
        console.log(`Ошибка:${err}`);
      });
  }, []);

  function closeAllPopups() {
    changeProfilePopupOpen(false);
    changePlacePopupOpen(false);
    changeAvatarPopupOpen(false);
    changeDeletePopupOpen(false);
    setSelectedCard({
      isImageOpen: false,
      name: "",
      link: "",
    });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          editProfile={onEditProfile}
          addPlace={onAddPlace}
          editAvatar={onEditAvatar}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
        <Footer />
        <ImagePopup
          isImageOpen={selectedCard.isImageOpen}
          name={selectedCard.name}
          link={selectedCard.link}
          onClose={closeAllPopups}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddCard={handleAddCard}
          isLoading={isLoading}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />
        <DeleteConfirmPopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onConfurm={handleConfurm}
          isLoading={isLoading}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
