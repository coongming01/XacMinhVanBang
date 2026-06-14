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

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Forward to Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name || 'degree-file',
    });
    pinataFormData.append('pinataMetadata', metadata);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
      },
      body: pinataFormData,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Pinata error:', errText);
      return NextResponse.json(
        { error: 'Failed to upload to Pinata' },
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
    console.error('Upload file error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
