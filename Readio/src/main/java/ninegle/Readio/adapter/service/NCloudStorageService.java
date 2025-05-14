package ninegle.Readio.adapter.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.global.exception.BusinessException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

/**
 * Readio - NCloudStorageService
 * create date:    25. 5. 14.
 * last update:    25. 5. 14.
 * author:  gigol
 * purpose: 네이버 클라우드 연동
 */
@Service
@RequiredArgsConstructor
public class NCloudStorageService {
	private final S3Client s3Client;

	@Value("${cloud.ncp.s3.bucket}")
	private String bucketName;

	public void uploadFile(String key, MultipartFile file) throws IOException {
		PutObjectRequest putRequest = PutObjectRequest.builder()
			.bucket(bucketName)
			.key(key)
			.contentType(file.getContentType())
			.build();

		s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
	}

	public byte[] downloadFile(String key) {
		GetObjectRequest getRequest = GetObjectRequest.builder()
			.bucket(bucketName)
			.key(key)
			.build();

		return s3Client.getObjectAsBytes(getRequest).asByteArray();
	}

}
