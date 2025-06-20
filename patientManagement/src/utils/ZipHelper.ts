import JSZip from 'jszip';

export async function createEncryptedZip(content: any, password: string): Promise<Buffer> {
    const zip = new JSZip();
    zip.file('medicalRecord.json', content);
    return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}
