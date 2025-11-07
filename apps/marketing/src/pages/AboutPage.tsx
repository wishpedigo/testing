import { Container, Typography, Box, Card } from '@wishlabs/shared';

const AboutPage = () => {
  return (
    <Container maxWidth="md" className="py-12">
      <Typography variant="h3" component="h1" gutterBottom>
        About Our Venue
      </Typography>
      
      <Box className="mt-8">
        <Card>
          <Typography variant="h5" gutterBottom>
            Our Mission
          </Typography>
          <Typography paragraph color="text.secondary">
            We're dedicated to providing the best entertainment experience for our
            community. Our venue combines cutting-edge technology with a welcoming
            atmosphere to create unforgettable moments.
          </Typography>
        </Card>
      </Box>

      <Box className="mt-6">
        <Card>
          <Typography variant="h5" gutterBottom>
            What We Offer
          </Typography>
          <Typography paragraph color="text.secondary">
            From interactive experiences to social activities, we offer a wide range of
            services designed to bring people together and create lasting memories.
            Join our community today and discover everything we have to offer!
          </Typography>
        </Card>
      </Box>
    </Container>
  );
};

export default AboutPage;

