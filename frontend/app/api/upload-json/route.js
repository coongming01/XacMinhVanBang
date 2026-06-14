import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const apiKey = process.env.PINATA_API_KEY;
    const secretKey = process.env.PINATA_SECRET_KEY;

    if (!apiKey || !secretKey) {
      return NextResponse.json(
        { error: 'Pinata API keys not configured' },
        { status: 500 }
      );
    }

    const jsonData = await request.json();

    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
      },
      body: JSON.stringify({
        pinataContent: jsonData,
        pinataMetadata: {
          name: jsonData.name || 'degree-metadata',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Pinata JSON error:', errText);
      return NextResponse.json(
        { error: 'Failed to upload JSON to Pinata' },
        { status: 500 }
      );
    }

    const data = await res.json();
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs';

    return NextResponse.json({
      ipfsHash: data.IpfsHash,
      ipfsUrl: `${gateway}/${data.IpfsHash}`,
    });
  } catch (error) {
    console.error('Upload JSON error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
