## URL Shortener Service

The URL Shortener Service is a backend application designed to provide users with the ability to shorten long URLs into more manageable and shareable links. This service aims to simplify the process of sharing URLs by generating compact and easy-to-use short links that redirect users to the original long URLs.

## API Endpoints

### 1. Shorten URL

- **Method**: POST
- **URL**: /api/shorten
- **Description**: Shortens a long URL and generates a unique shortened URL.
- **Request Body**:

  ```json
  {
    "longUrl": "https://www.example.com/very/long/url"
  }
  ```

- **Response**:
  ```json
  {
    "shortUrl": "https://short.url/abc123"
  }
  ```

### 2. Custom Shorten URL

- **Method**: POST
- **URL**: /api/custom-shorten
- **Description**: Allows users to customize the alias for their shortened URL.
- **Request Body**:
  ```json
  {
    "longUrl": "https://www.example.com/long/url",
    "customAlias": "my-custom-url"
  }
  ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "shortUrl": "https://short.url/my-custom-url"
    }
    ```

### 3. Redirect URL

- **Method**: GET
- **URL**: /:alias
- **Description**: Redirects users to the original long URL associated with the provided short URL.

### 4. URL Analytics

- **Method**: GET
- **URL**: /api/analytics/:urlId
- **Description**: Retrieves analytics data for a shortened URL, including click count, referrers, and click timestamps.
- **Response**:
  ```json
  {
    "clicks": 100,
    "clickTimestamps": ["2024-01-01T12:00:00Z", "2024-01-02T08:30:00Z", "..."]
  }
  ```

### 5. URL Expiration

- **Method**: PUT
- **URL**: /api/expiration/:urlId
- **Description**: Sets an expiration date for a shortened URL.
- **Request Body**:
  ```json
  {
    "expirationDate": "2024-12-31T23:59:59Z"
  }
  ```

### 6. URL Deletion

- **Method**: DELETE
- **URL**: /api/:urlId
- **Description**: Deletes a shortened URL and its associated analytics data.
- **Response**:
  ```json
  {
    "message": "Short URL deleted successfully"
  }
  ```
