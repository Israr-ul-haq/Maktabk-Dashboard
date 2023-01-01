import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import { initializeApp } from "firebase/app"
import {
  collection as fireStoreCollectione,
  query as fireStoreQuery,
  where as fireStoreWhere,
  getDocs as fireStoreDocs,
  onSnapshot,
  doc,
  QuerySnapshot,
  getFirestore,
  serverTimestamp,
  addDoc,
  orderBy,
  Firestore,
  Timestamp,
} from "firebase/firestore"
import { db, firebaseConfig } from "../../Firebase"

import moment from "moment"
import { AdminId } from "../../constants/AdminId"
import { GetUserById } from "../../functions/GetUserById"
import Loader from "../../shared/Loader"
import Firebase from "../../Firebase"

// Import the functions you need from the SDKs you need

const ChatRoom = () => {
  const appNew = initializeApp(firebaseConfig)
  const dbNew = getFirestore(appNew)
  const [users, setUsers] = useState([])
  const [chatRooms, setChatRooms] = useState([])
  const [roomId, setRoomId] = useState("")
  const [senderId, setSenderId] = useState()
  const [searchValue, setSearchValue] = useState("")
  const [loader, setLoader] = useState(true)
  const [messages, setMessages] = useState([])
  let [message, setMessage] = useState("")
  const [countUsers, setCountUsers] = useState(0)
  useEffect(() => {
    if (countUsers === 0) {
      getUsers(db)

      setCountUsers(1)
    }
  }, [countUsers])
  async function getUsers(db) {
    setLoader(true)
    const roomsCol = fireStoreQuery(fireStoreCollectione(dbNew, "ChatRooms"), fireStoreWhere("userIds", "array-contains", AdminId))
    const roomsSnapshot = await fireStoreDocs(roomsCol)
    const roomsList = roomsSnapshot.docs.map((doc) => doc.data())
    setLoader(false)
    setChatRooms(roomsList)
  }
  const getMessages = (data, roomID) => {
    setLoader(true)

    getMessagesData(db)
    setRoomId(roomID)
    setSenderId(data.id)
    async function getMessagesData(db) {
      const messagesCol = fireStoreQuery(fireStoreCollectione(dbNew, "Messages"), fireStoreWhere("roomId", "==", roomID), orderBy("timeStamp", "asc"))
      const messagesSnapshot = await fireStoreDocs(messagesCol)
      const messagesList = messagesSnapshot.docs.map((doc) => doc.data())
      let finalMessageList = messagesList.map((item) => {
        var date = new Date(item.timeStamp) // create Date object

        return {
          senderId: item.senderId,
          roomId: item.roomId,
          timeStamp: date,
          message: item.message,
        }
      })

      let sortedDates = finalMessageList.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.timeStamp) - new Date(a.timeStamp)
      })

      let reversedArray = sortedDates.reverse()
      setLoader(false)
      setMessages(reversedArray)
      setUsers(data)
    }
  }

  const search = async (search) => {
    const usersCol = fireStoreQuery(fireStoreCollectione(dbNew, "Users"), fireStoreWhere("name", "==", searchValue))
    const usersSnapshot = await fireStoreDocs(usersCol)
    const usersList = usersSnapshot.docs.map((doc) => doc.data())
    const output = usersList.filter(function (obj) {
      return chatRooms.filter((innerItem) => {
        return innerItem.userIds.indexOf(obj.id) !== -1
      })
    })
    console.log(output)
  }
  const d = new Date()
  d.setHours(d.getHours())
  const newTime = d.toISOString()
  const handleSubmit = async (e) => {
    e.preventDefault()
    await addDoc(fireStoreCollectione(dbNew, "Messages"), {
      message: message,
      roomId: roomId,
      senderId: AdminId,
      timeStamp: newTime,
    })
    message = ""
    document.querySelector(".chat_msg_box").value = ""
  }

  useEffect(() => {
    if (roomId !== "") {
      const q = fireStoreQuery(fireStoreCollectione(dbNew, "Messages"), fireStoreWhere("roomId", "==", roomId), orderBy("timeStamp", "asc"))

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setLoader(true)
        const messaages = []
        querySnapshot.forEach((doc) => {
          var date = new Date(doc.data().timeStamp) // create Date object

          messaages.push({
            message: doc.data().message,
            roomId: doc.data().roomId,
            senderId: doc.data().senderId,
            timeStamp: date,
          })
        })

        let sortedDates = messaages.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.timeStamp) - new Date(a.timeStamp)
        })

        let reversedArray = sortedDates.reverse()
        setMessages([...reversedArray])
        setLoader(false)
      })
    }
  }, [dbNew, roomId])

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title">Queries</h1>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                <div className="row">
                  <div className="col-xl-3 col-md-3">
                    <div className="border_right">
                      <div className="users_Chat chat_search">
                        {/* <input
                          className="chat_search"
                          type="text"
                          placeholder="Search"
                          onChange={(e) => setSearchValue(e.target.value)}
                          onKeyUp={search}
                          aria-label="Search Input"
                        /> */}
                      </div>

                      <div className="chat_sidebar">
                        {chatRooms.map((item) => {
                          return <GetUserById userId={item.userIds} roomId={item.id} getMessages={getMessages} />
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-9 col-md-9">
                    <div className="chat_card">
                      <div className="chat_header">
                        <img src={users.imageUrl ? users.imageUrl : "./img/avatar.png"} alt="avatar" className="person_img" />
                        <div>
                          <p className="chat_text">{users.email}</p>
                          <p className="person_pera text_size">
                            to <span className="chat_text text_size">me</span>
                          </p>
                        </div>
                        <p className="chat_text">{users.name}</p>
                      </div>
                      <div className="overflow_chat" id="scroll_down">
                        {loader
                          ? Loader
                          : messages.map((item) => {
                              return (
                                <>
                                  {loader ? (
                                    Loader
                                  ) : item.senderId === AdminId ? (
                                    <div className="reply_container">
                                      <p className="msg_timing">{moment(item?.timeStamp).format("hh:mm A")}</p>

                                      <div className="chat_right">
                                        <p className="chat_right_text"> {item?.message}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <div className="chat_details">
                                        <div className="chat_avatar">
                                          <img src={users?.imageUrl ? users?.imageUrl : "./img/avatar.png"} alt="avatar" className="left_chat" />
                                        </div>
                                        <div className="chat_container">
                                          <p className="chat_right_text">{item?.message}</p>
                                        </div>
                                        <p className="msg_timing"> {moment(item?.timeStamp).format("hh:mm A")}</p>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )
                            })}
                      </div>

                      <form onSubmit={handleSubmit}>
                        <div className="chat_footer">
                          <input
                            type="text"
                            name="username"
                            placeholder="Type something"
                            className="chat_msg_box"
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <button className="msg_send_btn" type="submit">
                            <img src="./img/Fill1.svg" className="send_icon" alt="" />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatRoom
