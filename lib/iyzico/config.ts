import crypto from 'crypto';

// iyzico Configuration
export const iyzicoConfig = {
    apiKey: process.env.IYZICO_API_KEY || '',
    secretKey: process.env.IYZICO_SECRET_KEY || '',
    uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
};

// Helper to check if we're in sandbox mode
export const isSandbox = () => {
    return iyzicoConfig.uri.includes('sandbox');
};

// Currency
export const CURRENCY = 'TRY';

// Locale
export const LOCALE = 'tr';

// Generate authorization header for Iyzico API
// Format: IYZWSv2 base64("apiKey:" + apiKey + "&randomKey:" + randomKey + "&signature:" + encryptedData)
// Where encryptedData = HMACSHA256(randomKey + uri.path + request.body, secretKey)
function generateAuthString(randomString: string, uri: string, requestBody: string): string {
    // Step 1: Create encrypted data using HMAC-SHA256
    const dataToSign = randomString + uri + requestBody;

    const encryptedData = crypto
        .createHmac('sha256', iyzicoConfig.secretKey)
        .update(dataToSign, 'utf8')
        .digest('hex');

    // Step 2: Create the authorization string
    const authString = `apiKey:${iyzicoConfig.apiKey}&randomKey:${randomString}&signature:${encryptedData}`;

    // Step 3: Base64 encode it
    const base64Auth = Buffer.from(authString, 'utf8').toString('base64');

    // Step 4: Add the scheme prefix
    const authorization = `IYZWSv2 ${base64Auth}`;

    console.log('=== SIGNATURE DEBUG ===');
    console.log('Random String:', randomString);
    console.log('URI:', uri);
    console.log('Request Body Length:', requestBody.length);
    console.log('Data to Sign:', dataToSign.substring(0, 100) + '...');
    console.log('Encrypted Data:', encryptedData);
    console.log('Auth String:', authString.substring(0, 80) + '...');
    console.log('Authorization:', authorization.substring(0, 60) + '...');
    console.log('======================');

    return authorization;
}

// Make request to Iyzico API
async function makeIyzicoRequest(endpoint: string, requestBody: any): Promise<any> {
    const url = `${iyzicoConfig.uri}${endpoint}`;
    const randomString = crypto.randomBytes(16).toString('hex');
    const bodyString = JSON.stringify(requestBody);
    const authorization = generateAuthString(randomString, endpoint, bodyString);

    console.log('Making Iyzico Request:', {
        url,
        endpoint,
        hasApiKey: !!iyzicoConfig.apiKey,
        hasSecretKey: !!iyzicoConfig.secretKey,
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': authorization,
            'x-iyzi-rnd': randomString,
        },
        body: bodyString,
    });

    const result = await response.json();

    console.log('Iyzico Response:', {
        status: result.status,
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
    });

    if (result.status !== 'success') {
        throw new Error(result.errorMessage || 'Iyzico request failed');
    }

    return result;
}

// Iyzico API wrapper
export const iyzico = {
    checkoutFormInitialize: {
        create: async (request: any) => {
            return makeIyzicoRequest('/payment/iyzipos/checkoutform/initialize/auth/ecom', request);
        }
    },
    checkoutForm: {
        retrieve: async (request: any) => {
            return makeIyzicoRequest('/payment/iyzipos/checkoutform/auth/ecom/detail', request);
        }
    }
};
