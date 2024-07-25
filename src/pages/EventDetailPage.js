import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { HOST } from "../services/api";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import "./BandDetailPage.css";
import Loading from "../components/Loading";

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.data);
      } catch (error) {
        console.error("Error fetching event details", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div>
        <Loading />
    </div>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>{event.title}</h1>
          <Row>
            <Col>
              <Carousel>
                {event.photos.map((photo, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={HOST + photo}
                      alt={`Slide ${index}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
          </Row>
          <p>{event.description}</p>
          <p>
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Band:</strong> {event.Band.name}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetailPage;
