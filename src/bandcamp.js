class BandcampClient {
  bandcampTokenUri = `${process.env.BANDCAMP_AUTH_URL}?client_id=${process.env.BANDCAMP_CLIENT_ID}&client_secret=${process.env.BANDCAMP_CLIENT_SECRET}&grant_type=client_credentials`;

  getToken = async () => {
    let res = await fetch(this.bandcampTokenUri, {
      method: 'POST',
    });
    if (res.ok) {
      let body = await res.json();
      return body.access_token;
    }
  };

  getOrders = async (bandId) => {
    let token = await this.getToken();
    let res = await fetch('https://bandcamp.com/api/merchorders/3/get_orders', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ band_id: bandId, unshipped_only: true }),
    });
    if (res.ok) {
      res = await res.json();
      return res;
    }
  };
}

module.exports = BandcampClient;
