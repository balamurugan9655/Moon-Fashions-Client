import React from "react";
import Header from "../components/Header";
import HomeCarousel from "../components/Carousel";
import OfferPage from "../components/Offer";
import CategorySection from "../components/CategorySection";
import CustomerReviews from "../components/CustomerReviews";
import Footer from "../components/Footer";

const Home = () => {
    return(
        <main>
            <Header />
            <HomeCarousel />
            <OfferPage />
            <CategorySection />
            <CustomerReviews />
            <Footer />
        </main>
    )
}

export default Home;