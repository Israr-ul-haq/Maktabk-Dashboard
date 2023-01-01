import { collection, getDocs, query, where } from "firebase/firestore/lite"
import moment from "moment"
import { useEffect, useState } from "react"
import { AdminId } from "../constants/AdminId"
import { db } from "../Firebase"
import Loader from "../shared/Loader"

export const GetUserById = ({ roomId, userId, getMessages, usersPropList }) => {
  const [item, setItem] = useState([])
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    getUserById()
  }, [])

  const getUserById = async () => {
    setLoader(true)
    let finalUserId = ""
    userId.forEach((element) => {
      if (element !== AdminId) {
        finalUserId = element
      }
    })
    const usersCol = query(collection(db, "Users"), where("id", "==", finalUserId.trim()))
    const usersSnapshot = await getDocs(usersCol)
    const usersList = usersSnapshot.docs.map((doc) => doc.data())
    setLoader(false)
    setItem(usersList)
  }

  return (
    <>
      {loader ? (
        Loader
      ) : (
        <div className="chat_persons" onClick={() => getMessages(item[0], roomId)}>
          <img src={item[0]?.imageUrl ? item[0]?.imageUrl : "./img/avatar.png"} alt="avatar" className="person_img" />
          <div className="person_content_sec">
            <div className="person_sub_sec">
              <h4 className="person_headline">{item[0]?.name}</h4>
              <p className="person_pera">Jan 5</p>
            </div>
            <p className="person_pera">{item[0]?.email}</p>
            <p className="person_pera" style={{ paddingBottom: "10px" }}>
              Lorem ipsum dolor sit amet Consectetur…
            </p>
          </div>
        </div>
      )}
    </>
  )
}
