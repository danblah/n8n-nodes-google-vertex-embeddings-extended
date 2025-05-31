import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GoogleVertexAuth implements ICredentialType {
	name = 'googleVertexAuth';
	displayName = 'Google Vertex Auth';
	documentationUrl = 'google/service-account';
	properties: INodeProperties[] = [
		{
			displayName: 'Service Account Email',
			name: 'email',
			type: 'string',
			placeholder: 'name@example.com',
			default: '',
			required: true,
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description:
				'Enter the private key from the JSON file generated for the service account',
		},
		{
			displayName: 'Project ID',
			name: 'projectId',
			type: 'string',
			default: '',
			required: true,
			description: 'The Google Cloud project ID',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{`https://${$credentials.region || "us-central1"}-aiplatform.googleapis.com`}}',
			url: '/v1/projects/{{$credentials.projectId}}/locations/{{$credentials.region || "us-central1"}}/models',
			method: 'GET',
		},
	};
} 