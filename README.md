# n8n-nodes-google-vertex-embeddings-extended

This is an n8n community sub-node that provides Google Vertex AI Embeddings with additional features, including support for output dimensions. Use this node with vector store nodes in n8n.

## Features

- Support for all Google Vertex AI embedding models
- **Output dimensions configuration** (for supported models like text-embedding-004)
- Task type specification for optimized embeddings
- Region selection
- Works as a sub-node with vector stores and other AI nodes

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

This is a **sub-node** that provides embeddings functionality to other n8n AI nodes.

### Using with Vector Stores

1. Add a vector store node to your workflow (e.g., Pinecone, Qdrant, Supabase Vector Store)
2. Connect the **Embeddings Google Vertex Extended** node to the embeddings input of the vector store
3. Configure your Google Vertex Auth credentials
4. Select your preferred model and configure options
5. The vector store will use these embeddings to process your documents

### Example Workflow

```
[Document Loader] → [Vector Store] ← [Embeddings Google Vertex Extended]
                          ↓
                    [AI Agent/Chain]
```

### Configuration Options

#### Models

- `text-embedding-004` (Latest, supports output dimensions)
- `text-multilingual-embedding-002` (Multilingual support, supports output dimensions)
- `textembedding-gecko@003`
- `textembedding-gecko@002`
- `textembedding-gecko@001`
- `textembedding-gecko-multilingual@001`

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

## Use Cases

- **Semantic Search**: Generate embeddings for documents and queries in vector stores
- **RAG Applications**: Build retrieval-augmented generation systems with custom embeddings
- **Document Similarity**: Find similar documents in your vector database
- **Multi-language Support**: Use multilingual models for international applications

## Differences from Official n8n Node

This community node extends the official Google Vertex AI Embeddings node with:

1. **Output Dimensions Support**: Configure the size of embedding vectors
2. **Direct API Integration**: More control over API parameters
3. **Task Type Selection**: Optimize embeddings for specific use cases

## Compatible Nodes

This embeddings node can be used with:

- Simple Vector Store
- Pinecone Vector Store
- Qdrant Vector Store
- Supabase Vector Store
- PGVector Vector Store
- Milvus Vector Store
- MongoDB Atlas Vector Store
- Zep Vector Store
- Question and Answer Chain
- AI Agent nodes

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

4. **Connection Issues**
   - This is a sub-node and cannot be used standalone
   - Must be connected to a compatible root node (vector store, AI chain, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/danblah/n8n-nodes-google-vertex-embeddings-extended/issues).

## Changelog

### 0.2.0
- Converted to sub-node architecture for use with vector stores
- Improved compatibility with n8n AI nodes

### 0.1.0
- Initial release
- Support for Google Vertex AI embeddings
- Output dimensions configuration
- Task type selection 