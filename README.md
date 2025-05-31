# n8n-nodes-google-vertex-embeddings-extended

This is an n8n community node that provides access to Google Vertex AI Embeddings with additional features, including support for output dimensions.

## Features

- Support for all Google Vertex AI embedding models
- **Output dimensions configuration** (for supported models like text-embedding-004)
- Task type specification for optimized embeddings
- Region selection
- Full integration with n8n workflows

## Installation

### Community Node (Recommended)

1. In n8n, go to **Settings** > **Community Nodes**
2. Search for `n8n-nodes-google-vertex-embeddings-extended`
3. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-google-vertex-embeddings-extended
```

## Setup

### Prerequisites

1. A Google Cloud Platform account
2. A project with Vertex AI API enabled
3. Service account credentials with appropriate permissions

### Authentication

1. Create a service account in your Google Cloud Console
2. Download the JSON credentials file
3. In n8n, create new credentials:
   - Type: **Google Vertex Auth**
   - Service Account Email: Your service account email
   - Private Key: The private key from your JSON file
   - Project ID: Your Google Cloud project ID

## Usage

### Basic Usage

1. Add the **Embeddings Google Vertex Extended** node to your workflow
2. Configure your Google Vertex Auth credentials
3. Enter the text you want to generate embeddings for
4. Select your preferred model
5. Run the node

### Advanced Configuration

#### Output Dimensions

For models that support it (like `text-embedding-004`), you can specify the number of output dimensions:

- Set to `0` to use the model's default dimensions
- Set to a specific number (e.g., `256`, `512`) to get embeddings of that size

#### Task Types

Optimize your embeddings by specifying the task type:

- **Retrieval Document**: For document storage in retrieval systems
- **Retrieval Query**: For search queries
- **Semantic Similarity**: For comparing text similarity
- **Classification**: For text classification tasks
- **Clustering**: For grouping similar texts

## Supported Models

- `text-embedding-004` (Latest, supports output dimensions)
- `text-multilingual-embedding-002` (Multilingual support, supports output dimensions)
- `textembedding-gecko@003`
- `textembedding-gecko@002`
- `textembedding-gecko@001`
- `textembedding-gecko-multilingual@001`

## Example Output

```json
{
  "embeddings": [0.123, -0.456, 0.789, ...],
  "model": "text-embedding-004",
  "dimensions": 768
}
```

## Use Cases

- **Semantic Search**: Generate embeddings for documents and queries
- **Text Classification**: Create feature vectors for ML models
- **Clustering**: Group similar documents together
- **Recommendation Systems**: Find similar items based on text descriptions
- **RAG Applications**: Build retrieval-augmented generation systems

## Differences from Official n8n Node

This community node extends the official Google Vertex AI Embeddings node with:

1. **Output Dimensions Support**: Configure the size of embedding vectors
2. **Direct API Integration**: More control over API parameters
3. **Detailed Response**: Returns dimension count and model information

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Ensure your service account has the `Vertex AI User` role
   - Check that the Vertex AI API is enabled in your project

2. **Region Errors**
   - Make sure the selected region supports the chosen model
   - Default region is `us-central1`

3. **Dimension Errors**
   - Not all models support custom dimensions
   - Check model documentation for supported dimension values

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/yourusername/n8n-nodes-google-vertex-embeddings-extended/issues).

## Changelog

### 0.1.0
- Initial release
- Support for Google Vertex AI embeddings
- Output dimensions configuration
- Task type selection 