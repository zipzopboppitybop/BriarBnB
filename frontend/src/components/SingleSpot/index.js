import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneSpot } from '../../store/spots';
import { useEffect } from 'react';
import { getReviewsSpot } from '../../store/reviews';
import { getBookingsSpot } from '../../store/bookings';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import ReviewForm from '../ReviewModal';
import ReviewFormModal from '../ReviewModal/ReviewFormModal';
import SingleSpotReviewItem from '../SingleSpotReviewItem';
import BookingForm from '../BookingModal';
import BookingFormModal from '../BookingModal/BookingFormModal';


const SingleSpot = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const spot = useSelector(state => state.spots.singleSpot);
    const reviews = useSelector(state => state.reviews.spot);
    const bookings = useSelector(state => state.bookings.spot)
    const sessionUser = useSelector(state => state.session.user)
    let createReviewClassName = "hidden";
    let numReviews = "reviews";
    let reviewsArr = []

    if (reviews) {
        for (const i in reviews) {
            let review = reviews[i]
            if (review.spotId === spot.id) reviewsArr.push(review);
        }
        reviewsArr?.sort((a, b) => (a.id < b.id) ? 1 : -1)
    }

    useEffect(() => {
        dispatch(getOneSpot(id));
        dispatch(getReviewsSpot(id));
        dispatch(getBookingsSpot(id));
    }, [dispatch]);

    if (sessionUser) {
        if (sessionUser.id === spot.ownerId) createReviewClassName = "hidden";
        else createReviewClassName = "";

        for (let i = 0; i < reviewsArr.length; i++) {
            const review = reviewsArr[i];
            if (review.userId === sessionUser.id) {
                createReviewClassName = "hidden";
            }
        }
    }


    if (spot.numReviews === 1) numReviews = "review"
    else if (spot.numReviews < 1) numReviews = ""
    else if (spot.numReviews === 0) spot.numReviews = ""

    const dot = () => {
        if (spot.numReviews > 0) return (<span>&middot;</span>)
        else return ""
    }

    // const reserveButton = () => {
    //     if (!sessionUser) return ()
    //     else if (spot.ownerId === sessionUser?.id) {
    //         <button className="not-possible">
    //             Not Possible
    //         </button>
    //     }
    // }

    if (!spot) return null;

    return (

        <div className='singleSpot'>
            <h1 className='content content-title'>{spot.name}</h1>
            <h3 className='content'>{spot.city}, {spot.state}, {spot.country} </h3>

            <div className='image-container'>
                <ul className='images'>
                    {spot.SpotImages?.length < 1 ? spot.SpotImages?.map((image) => (
                        <li key={image.id}>
                            <img src={image.url} ></img>
                        </li>
                    )) : spot.SpotImages?.map((image) =>
                        <li className='small' key={image.id}>
                            <img className='small' src={image.url}></img>
                        </li>)}
                </ul>
            </div>

            <div className='flex-container'>
                <h1 className='content'>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h1>
                <div className='reserve'>
                    <p className='reserve-description'>${spot.price} night </p>
                    <p className='reserve-description'>
                        <i className='fas fa-star' />
                        {spot.avgStarRating > 0 ? (Number.parseFloat(spot.avgStarRating).toFixed(2)) : ("New")}  {dot()} {spot.numReviews > 0 ? spot.numReviews : ""} {numReviews}
                    </p>


                    {spot.ownerId === sessionUser?.id ? (
                        <button className="not-possible">
                            Not Possible
                        </button>

                    ) : (
                        <button className='reserve-button'>
                            <BookingFormModal itemText={"Reserve"}
                                modalComponent={<BookingForm />} />
                        </button>
                    )}


                </div>
            </div>
            <div>
                <p className='content description move-up'>
                    {spot.description}
                </p>

            </div>
            <br />
            <br />
            <hr></hr>

            <h1 className='content review-title'><i className='fas fa-star' />
                {spot.avgStarRating > 0 ? (Number.parseFloat(spot.avgStarRating).toFixed(2)) : ("New")}
                &nbsp;
                {dot()}
                &nbsp;
                {spot.numReviews > 0 ? spot.numReviews : ""}
                &nbsp;
                {numReviews}
            </h1>
            <div className={createReviewClassName}>
                <ReviewFormModal
                    itemText={"Post Your Review"}
                    modalComponent={<ReviewForm />}
                />
            </div>
            <ul className='reviews'>
                {reviewsArr?.length > 0 ? (reviewsArr?.map((review) => (
                    <li key={review.id}>
                        <SingleSpotReviewItem review={review} />
                    </li>
                ))) : "Be the first to post a review!"}
            </ul>
        </div>
    );
};

export default SingleSpot;
