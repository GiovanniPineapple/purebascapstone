import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserForm from './formuser';
import UserList from './userlist';
import AddServiceForm from './addservice';
import ServiceList from './servicelist';
import ServiceListCard from './ServiceListCard';
import ServiceListCardnu from './ServiceListCardnu';
import CreateAvailableHour from './createavailablehour';
import SelectAppointment from './selectappointment';
import AppointmentAndPayment from './AppointmentAndPayment';
import Payment from './payment';
import PaymentResult from './PaymentResult'; 
import Notices from './Notices';
import ContactForm from './ContactForm';
import Horario from './horario';
import NotFound from './NotFound';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './clientdashboard';
import Login from './login';
import AboutUs from './AboutUs';
import CreateCoupon from './CreateCoupon';
import CouponList from './CouponList';
import ConfirmAppointment from './confirmappointment';
import PaymentInitiation from './PaymentInitiation';
import PaymentConfirmation from './PaymentConfirmation';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';
import NoticeForm from './NoticeForm';
import NoticesList from './NoticesList';
import NoticeDetail from './NoticeDetail';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';
import AdminCalendar from './AdminCalendar';

const AppRoutes = () => {
    const { authData } = useAuth();
    const role = authData?.role || 'no_logeado';
    
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/noticias" element={<Notices />} />
            <Route path="/contactform" element={<ContactForm />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/servicelistcardnu" element={<ServiceListCardnu />} />
            <Route path="/notice/:id" element={<NoticeDetail />} />
            <Route path="/feedback-list" element={<FeedbackList />} />
            <Route path="*" element={<NotFound />} />
            
            {/* Rutas compartidas (Cliente y Admin) */}
            {['cliente', 'admin'].includes(role) && (
                <>
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/select-appointment" element={<SelectAppointment />} />
                    <Route path="/payment-initiation" element={<PaymentInitiation />} />
                    <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-failed" element={<PaymentFailed />} />
                    <Route path="/payment-result" element={<PaymentResult />} />
                    <Route path="*" element={<NotFound />} />
                </>
            )}

            {/* Rutas específicas por rol */}
            {role === 'cliente' && (
                <>
                    <Route path="/client-dashboard" element={<ClientDashboard />} />
                    <Route path="/confirm-appointment" element={<ConfirmAppointment />} />
                    <Route path="/ServiceListCard" element={<ServiceListCard />} />
                    <Route path="/appointmentandpayment" element={<AppointmentAndPayment />} />
                    <Route path="/feedback-form" element={<FeedbackForm />} />
                    <Route path="/payment-result" element={<PaymentResult />} />
                    
                </>
            )}

            {role === 'entrenador' && (
                <Route path="/horario" element={<Horario />} />
            )}

            {role === 'admin' && (
                <>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/formuser" element={<UserForm />} />
                    <Route path="/userlist" element={<UserList />} />
                    <Route path="/addservice" element={<AddServiceForm />} />
                    <Route path="/servicelist" element={<ServiceList />} />
                    <Route path="/createavailablehour" element={<CreateAvailableHour />} />
                    <Route path="/createcoupon" element={<CreateCoupon />} />
                    <Route path="/couponlist" element={<CouponList />} />
                    <Route path="/NoticeForm" element={<NoticeForm />} />
                    <Route path="/NoticesList" element={<NoticesList />} />
                    <Route path="/AdminCalendar" element={<AdminCalendar />} />
                    <Route path="/horario" element={<Horario />} />

                </>
            )}

            


            
            
        </Routes>
    );
};

export default AppRoutes;
