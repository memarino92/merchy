class BandcampClient {
  constructor(clientId, clientSecret) {
    this.tokenUri = 'https://bandcamp.com/oauth_token';
    this.token = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  getToken = async () => {
    if (this.expiresAt && new Date().getTime() >= this.expiresAt)
      this.token = null;

    if (this.token) return this.token;

    await this.fetchToken();

    return this.token;
  };

  fetchToken = async () => {
    if (this.refreshToken) {
      let refreshTokenUri =
        this.tokenUri +
        `?refresh_token=${this.refreshToken}` +
        `&client_id=${this.clientId}` +
        `&client_secret=${this.clientSecret}` +
        `&grant_type=refresh_token`;

      let res = await fetch(refreshTokenUri, {
        method: 'POST',
      });

      if (res.ok) {
        let body = await res.json();
        console.log(
          `${new Date().toISOString()} Successfully retrieved Bandcamp access token using refresh token`
        );
        this.token = body.access_token;
        this.expiresAt = new Date().getTime() + body.expires_in;
        this.refreshToken = body.refresh_token;

        return;
      }

      //if fetching new token fails clear refresh token
      this.refreshToken = null;

      let body = await res.json();
      console.log(
        `${new Date().toISOString()} Error fetching access token using refresh token:\n`,
        body
      );
      return;
    }

    let tokenUri =
      this.tokenUri +
      `?client_id=${this.clientId}` +
      `&client_secret=${this.clientSecret}` +
      `&grant_type=client_credentials`;

    let res = await fetch(tokenUri, {
      method: 'POST',
    });

    if (res.ok) {
      let body = await res.json();
      console.log(
        `${new Date().toISOString()} Successfully retrieved Bandcamp access token`
      );
      this.token = body.access_token;
      this.expiresAt = new Date().getTime() + body.expires_in;
      this.refreshToken = body.refresh_token;

      return;
    }

    let body = await res.json();
    console.log(
      `${new Date().toISOString()} Error fetching access token:\n`,
      body
    );

    return;
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
