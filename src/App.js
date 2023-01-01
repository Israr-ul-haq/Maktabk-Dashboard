import { Switch, Route, HashRouter } from "react-router-dom"

import PrivateRoute from "./components/Common/PrivateRoute"
import Login from "./components/Account/Login/Login"
import AuthLayout from "./layouts/AuthLayout"
import WebLayout from "./layouts/WebLayout"
import Register from "./components/Account/Register/Register"
import Dashboard from "./components/Dashboard/Dashboard"
import Features from "./components/Features/Features"
import FeaturesAdd from "./components/Features/FeaturesAdd"
import "jquery/dist/jquery.min.js"
//Datatable Modules
import "datatables.net/js/jquery.dataTables.min.js"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import "datatables.net-buttons/js/buttons.colVis"
import "datatables.net-buttons/js/buttons.html5"
import "datatables.net-buttons/js/buttons.flash"
import "datatables.net-buttons/js/buttons.print"
import ManageVerifications from "./components/Verifications/ManageVerifications"
import ViewProfileBusiness from "./components/Verifications/ViewProfileBusiness"
import ManageOffers from "./components/Offers/ManageOffers"
import AddNewOffer from "./components/Offers/AddNewOffer"
import ViewOffer from "./components/Offers/ViewOffer"
import EditOffers from "./components/Offers/EditOffers"
import ManageEvent from "./components/Event/ManageEvent"
import AddNewEvent from "./components/Event/AddNewEvent"
import EditEvent from "./components/Event/EditEvent"
import ViewEvent from "./components/Event/ViewEvent"
import ManageSubscription from "./components/Subscription/ManageSubscription"
import EditSubscription from "./components/Subscription/EditSubscription"
import Finance from "./components/Finance/Finance"
import ManageVoucher from "./components/Voucher/ManageVoucher"
import AddNewVoucher from "./components/Voucher/AddNewVoucher"
import ViewVoucherDetail from "./components/Voucher/ViewVoucherDetail"
import EditVoucher from "./components/Voucher/EditVoucher"
import ManageReport from "./components/Report/ManageReport"
import ManageSubAdmin from "./components/User/UserSubAdmin/ManageSubAdmin"
import AddNewSubAdmin from "./components/User/UserSubAdmin/AddNewSubAdmin"
import ViewSubAdmin from "./components/User/UserSubAdmin/ViewSubAdmin"
import EditSubAdmin from "./components/User/UserSubAdmin/EditSubAdmin"
import ManageCSP from "./components/User/CSP/ManageCSP"
import AddNewCSP from "./components/User/CSP/AddNewCSP"
import ViewCSP from "./components/User/CSP/ViewCSP"
import EditCSP from "./components/User/CSP/EditCSP"
import ManageBusinessOwner from "./components/User/BusinessOwner/ManageBusinessOwner"
import AddNewBusinessOwner from "./components/User/BusinessOwner/AddNewBusinessOwner"
import EditBusinessOwner from "./components/User/BusinessOwner/EditBusinessOwner"
import ViewBusinessOwner from "./components/User/BusinessOwner/ViewBusinessOwner"
import ManageUser from "./components/User/ManageUser/ManageUser"
import EditUser from "./components/User/ManageUser/EditUser"
import ViewUser from "./components/User/ManageUser/ViewUser"
import AddNewUser from "./components/User/ManageUser/AddNewUser"
import EditFeature from "./components/Features/EditFeature"
import Profile from "./components/Profile/Profile"
import ViewFeature from "./components/Features/ViewFeature"
import ViewSubscription from "./components/Subscription/ViewSubscription"
import AddNewSubscription from "./components/Subscription/AddNewSubscription"
import ManageCategory from "./components/Category/ManageCategory"
import AddNewCategory from "./components/Category/AddNewCategory"
import EditCategory from "./components/Category/EditCategory"
import ViewCategory from "./components/Category/ViewCategory"
import AddNewSlot from "./components/Slots/AddNewSlot"
import ManageSlots from "./components/Slots/ManageSlots"
import ManageBooking from "./components/Booking/ManageBooking"
import EditSlot from "./components/Slots/EditSlot"
import AddNewBooking from "./components/Booking/AddNewBooking"
import EditBooking from "./components/Booking/EditBooking"
import ViewBooking from "./components/Booking/ViewBooking.js"
import ViewSlots from "./components/Slots/ViewSlots"
import ManageCheckIn from "./components/CheckIn/ManageCheckIn"
import ManageAds from "./components/Ads/ManageAds"
import AddNewAd from "./components/Ads/AddNewAds"
import EditAds from "./components/Ads/EditAds"
import ManageQueries from "./components/Query/ManageQueries"
import QueryReply from "./components/Query/QueryReply"
import EditProfile from "./components/Profile/EditProfile"
import ScrollFromTop from "./shared/ScrollFromTop"
import ChatRoom from "./components/Query/ChatRoom"
import ManagePlaces from "./components/NearByPlaces/ManagePlaces"
import AddPlaces from "./components/NearByPlaces/AddPlaces"
import EditPlace from "./components/NearByPlaces/EditPlaces"
import ViewPlaces from "./components/NearByPlaces/ViewPlaces"

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/account/:path?">
          <AuthLayout>
            <Switch>
              <Route path={"/account/login"} exact component={Login} />
              <Route path={"/account/register"} component={Register} />
            </Switch>
          </AuthLayout>
        </Route>
        {/* <Route> */}
        <Route>
          <WebLayout>
            <Switch>
              <ScrollFromTop>
                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute path="/Profile" component={Profile} />
                <PrivateRoute path="/Features" component={Features} />
                <PrivateRoute path="/FeaturesAdd" component={FeaturesAdd} />
                <PrivateRoute path="/ManageVerifications" component={ManageVerifications} />
                <PrivateRoute path="/ViewProfileBusiness/:UserId" component={ViewProfileBusiness} />
                <PrivateRoute path="/ManageOffers" component={ManageOffers} />
                <PrivateRoute path="/AddNewOffer" component={AddNewOffer} />
                <PrivateRoute path="/ViewOffer/:OfferId" component={ViewOffer} />
                <PrivateRoute path="/EditOffers/:OfferId" component={EditOffers} />
                <PrivateRoute path="/ManageEvent" component={ManageEvent} />
                <PrivateRoute path="/AddNewEvent" component={AddNewEvent} />
                <PrivateRoute path="/EditEvent/:EventId" component={EditEvent} />
                <PrivateRoute path="/ViewEvent/:EventId" component={ViewEvent} />
                <PrivateRoute path="/ManageSubscription" component={ManageSubscription} />
                <PrivateRoute path="/ViewSubscription/:SubscriptionId" component={ViewSubscription} />
                <PrivateRoute path="/AddNewSubscription" component={AddNewSubscription} />
                <PrivateRoute path="/EditSubscription/:SubscriptionId" component={EditSubscription} />
                <PrivateRoute path="/Finance" component={Finance} />
                <PrivateRoute path="/ManageVoucher" component={ManageVoucher} />
                <PrivateRoute path="/AddNewVoucher" component={AddNewVoucher} />
                <PrivateRoute path="/ViewVoucherDetail/:VoucherId" component={ViewVoucherDetail} />
                <PrivateRoute path="/EditVoucher/:VoucherId" component={EditVoucher} />
                <PrivateRoute path="/ManageReport" component={ManageReport} />
                <PrivateRoute path="/ManageSubAdmin" component={ManageSubAdmin} />
                <PrivateRoute path="/AddNewSubAdmin" component={AddNewSubAdmin} />
                <PrivateRoute path="/ViewSubAdmin/:UserId" component={ViewSubAdmin} />
                <PrivateRoute path="/EditSubAdmin/:UserId" component={EditSubAdmin} />
                <PrivateRoute path="/ManageCSP" component={ManageCSP} />
                <PrivateRoute path="/AddNewCSP" component={AddNewCSP} />
                <PrivateRoute path="/ViewCSP/:UserId" component={ViewCSP} />
                <PrivateRoute path="/EditCSP/:UserId" component={EditCSP} />
                <PrivateRoute path="/ManageBusinessOwner" component={ManageBusinessOwner} />
                <PrivateRoute path="/AddNewBusinessOwner" component={AddNewBusinessOwner} />
                <PrivateRoute path="/EditBusinessOwner/:UserId" component={EditBusinessOwner} />
                <PrivateRoute path="/ViewBusinessOwner/:UserId" component={ViewBusinessOwner} />
                <PrivateRoute path="/ManageUser" component={ManageUser} />
                <PrivateRoute path="/AddNewUser" component={AddNewUser} />
                <PrivateRoute path="/EditUser/:UserId" component={EditUser} />
                <PrivateRoute path="/ViewUser/:UserId" component={ViewUser} />
                <PrivateRoute path="/EditFeature/:FeatureId" component={EditFeature} />
                <PrivateRoute path="/ViewFeature/:FeatureId" component={ViewFeature} />
                <PrivateRoute path="/ManageCategory" component={ManageCategory} />
                <PrivateRoute path="/AddNewCategory" component={AddNewCategory} />
                <PrivateRoute path="/EditCategory/:CategoryId" component={EditCategory} />
                <PrivateRoute path="/ViewCategory/:CategoryId" component={ViewCategory} />
                <PrivateRoute path="/AddNewSlot/:BusinessId" component={AddNewSlot} />
                <PrivateRoute path="/ManageSlots" component={ManageSlots} />
                <PrivateRoute path="/ManageBooking" component={ManageBooking} />
                <PrivateRoute path="/AddNewBooking" component={AddNewBooking} />
                <PrivateRoute path="/EditSlot/:BusinessSlotId/:BusinessId" component={EditSlot} />
                <PrivateRoute path="/ViewSlots/:BusinessId" component={ViewSlots} />
                <PrivateRoute path="/EditBooking/:BookingId" component={EditBooking} />
                <PrivateRoute path="/ViewBooking/:BookingId/:Status" component={ViewBooking} />
                <PrivateRoute path="/ManageCheckIn" component={ManageCheckIn} />
                <PrivateRoute path="/ManageAds" component={ManageAds} />
                <PrivateRoute path="/AddNewAd" component={AddNewAd} />
                <PrivateRoute path="/EditAds/:Id" component={EditAds} />
                <PrivateRoute path="/ManageQueries" component={ManageQueries} />
                <PrivateRoute path="/QueryReply/:id" component={QueryReply} />
                <PrivateRoute path="/EditProfile" component={EditProfile} />
                <PrivateRoute path="/ChatRoom" component={ChatRoom} />
                <PrivateRoute path="/ManagePlaces" component={ManagePlaces} />
                <PrivateRoute path="/AddPlaces" component={AddPlaces} />
                <PrivateRoute path="/EditPlaces/:PlaceId" component={EditPlace} />
                <PrivateRoute path="/ViewPlaces/:PlaceId" component={ViewPlaces} />
              </ScrollFromTop>
            </Switch>
          </WebLayout>
        </Route>
      </Switch>
    </HashRouter>
  )
}

export default App
