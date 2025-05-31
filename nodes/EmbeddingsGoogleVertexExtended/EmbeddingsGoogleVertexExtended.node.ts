import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { GoogleAuth } from 'google-auth-library';

export class EmbeddingsGoogleVertexExtended implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Embeddings Google Vertex Extended',
		name: 'embeddingsGoogleVertexExtended',
		icon: 'file:GoogleVertexAI.svg',
		group: ['transform'],
		version: 1,
		description: 'Use Google Vertex AI Embeddings with output dimensions support',
		defaults: {
			name: 'Embeddings Google Vertex Extended',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Embeddings'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsgooglevertex/',
					},
				],
			},
		},
		credentials: [
			{
				name: 'googleVertexAuth',
				required: true,
			},
		],
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'Text to generate embeddings for',
				description: 'The text to generate embeddings for',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				description:
					'The model which will generate the embeddings. <a href="https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/text-embeddings-api">Learn more</a>.',
				default: 'text-embedding-004',
				options: [
					{
						name: 'Text-embedding-004',
						value: 'text-embedding-004',
					},
					{
						name: 'Text-multilingual-embedding-002',
						value: 'text-multilingual-embedding-002',
					},
					{
						name: 'Textembedding-gecko@003',
						value: 'textembedding-gecko@003',
					},
					{
						name: 'Textembedding-gecko@002',
						value: 'textembedding-gecko@002',
					},
					{
						name: 'Textembedding-gecko@001',
						value: 'textembedding-gecko@001',
					},
					{
						name: 'Textembedding-gecko-multilingual@001',
						value: 'textembedding-gecko-multilingual@001',
					},
				],
			},
			{
				displayName: 'Output Dimensions',
				name: 'outputDimensions',
				type: 'number',
				default: 0,
				description: 'The number of dimensions for the output embeddings. Set to 0 to use the model default. Only supported by certain models like text-embedding-004.',
				displayOptions: {
					show: {
						model: ['text-embedding-004', 'text-multilingual-embedding-002'],
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				placeholder: 'Add Option',
				description: 'Additional options',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'Region',
						name: 'region',
						type: 'string',
						default: 'us-central1',
						description: 'The region where the model is deployed',
					},
					{
						displayName: 'Task Type',
						name: 'taskType',
						type: 'options',
						default: 'RETRIEVAL_DOCUMENT',
						description: 'The type of task for which the embeddings will be used',
						options: [
							{
								name: 'Retrieval Document',
								value: 'RETRIEVAL_DOCUMENT',
							},
							{
								name: 'Retrieval Query',
								value: 'RETRIEVAL_QUERY',
							},
							{
								name: 'Semantic Similarity',
								value: 'SEMANTIC_SIMILARITY',
							},
							{
								name: 'Classification',
								value: 'CLASSIFICATION',
							},
							{
								name: 'Clustering',
								value: 'CLUSTERING',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('googleVertexAuth');

		const projectId = credentials.projectId as string;
		const email = credentials.email as string;
		const privateKey = (credentials.privateKey as string).replace(/\\n/g, '\n');

		const auth = new GoogleAuth({
			credentials: {
				client_email: email,
				private_key: privateKey,
			},
			scopes: ['https://www.googleapis.com/auth/cloud-platform'],
		});

		const client = await auth.getClient();
		const accessToken = await client.getAccessToken();

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const text = this.getNodeParameter('text', itemIndex) as string;
				const modelName = this.getNodeParameter('model', itemIndex) as string;
				const outputDimensions = this.getNodeParameter('outputDimensions', itemIndex) as number;
				const options = this.getNodeParameter('options', itemIndex, {}) as {
					region?: string;
					taskType?: string;
				};

				const region = options.region || 'us-central1';
				const endpoint = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${modelName}:predict`;

				const requestBody: any = {
					instances: [
						{
							content: text,
							...(options.taskType && { task_type: options.taskType }),
						},
					],
					parameters: {
						...(outputDimensions > 0 && { outputDimensionality: outputDimensions }),
					},
				};

				const response = await this.helpers.httpRequest({
					method: 'POST',
					url: endpoint,
					headers: {
						Authorization: `Bearer ${accessToken.token}`,
						'Content-Type': 'application/json',
					},
					body: requestBody,
				});

				if (response.predictions && response.predictions.length > 0) {
					const embeddings = response.predictions[0].embeddings;
					returnData.push({
						json: {
							embeddings: embeddings.values || embeddings,
							model: modelName,
							dimensions: embeddings.values ? embeddings.values.length : embeddings.length,
						},
						pairedItem: { item: itemIndex },
					});
				} else {
					throw new NodeOperationError(this.getNode(), 'No embeddings returned from API');
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({
						json: { error: errorMessage },
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 