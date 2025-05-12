package ninegle.Readio.library.service;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ninegle.Readio.admin.domain.User;
import ninegle.Readio.admin.repository.UserRepository;
import ninegle.Readio.admin.service.UserContextService;
import ninegle.Readio.global.unit.BaseResponse;
import ninegle.Readio.library.domain.Library;
import ninegle.Readio.library.dto.NewLibraryRequestDto;
import ninegle.Readio.library.dto.NewLibraryResponseDto;
import ninegle.Readio.library.mapper.LibraryMapper;
import ninegle.Readio.library.repository.LibraryRepository;

@Service
@RequiredArgsConstructor
public class LibraryService {

	private final LibraryRepository repository;
	private final UserContextService userContextService;
	private final UserRepository userRepository;

	//라이브러리 생성
	public ResponseEntity<BaseResponse<NewLibraryResponseDto>> newLibrary(NewLibraryRequestDto newLibraryRequestDto) {

		//유저 정보를 꺼내고
		Long userId = userContextService.getCurrentUserId();
		Optional<User> finduser = userRepository.findById(userId);

		if (finduser.isEmpty()) {
			return BaseResponse.error("사용자가 존재하지 않습니다", null, HttpStatus.UNAUTHORIZED);
		}
		User user = finduser.get();

		//들어온 라이브러리 이름 dto에서 꺼내기
		Library library = LibraryMapper.toNewLibraryEntity(newLibraryRequestDto, user);
		repository.save(library);
		NewLibraryResponseDto responseDto = LibraryMapper.NewLibrarytoRsponseDto(library.getId(),
			library.getLibraryName(),
			user.getId());

		return BaseResponse.ok("라이브러리 추가가 정상적으로 수행되었습니다", responseDto, HttpStatus.CREATED); //201
	}

	// public ResponseEntity<BaseResponse<?>> deleteLibrary(Long libraryId) {
	//
	// }

}
