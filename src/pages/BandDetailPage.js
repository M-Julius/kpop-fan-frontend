import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { HOST } from "../services/api";
import { Container, Row, Col, Carousel, ListGroup } from "react-bootstrap";
import "./BandDetailPage.css";
import Loading from "../components/Loading";

const BandDetailPage = () => {
  const { id } = useParams();
  const [band, setBand] = useState(null);

  useEffect(() => {
    const fetchBand = async () => {
      try {
        const response = await api.get(`/bands/${id}`);
        setBand(response.data.data);
      } catch (error) {
        console.error("Error fetching band details", error);
      }
    };

    fetchBand();
  }, [id]);

  if (!band) {
    return <div>
      <Loading />
    </div>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>{band.name}</h1>
          <Row>
            <Col>
              <Carousel>
                {band.photoGroup.map((photo, index) => {
                  return (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={HOST + photo}
                        alt={`Slide ${index}`}
                      />
                    </Carousel.Item>
                  )
                })}
              </Carousel>
            </Col>
          </Row>
          <p>{band.description}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Members</h2>
          <ListGroup>
            {band.members.map((member, index) => (
              <ListGroup.Item key={index}>
                <strong>{member.name}</strong> - {member.role}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Playlist</h2>
          <ListGroup>
            {band.playlist.map((song, index) => (
              <ListGroup.Item key={index}>
                <strong>{song.song}</strong> -{" "}
                <a href={song.url} target="_blank" rel="noopener noreferrer">
                  Listen
                </a>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default BandDetailPage;
