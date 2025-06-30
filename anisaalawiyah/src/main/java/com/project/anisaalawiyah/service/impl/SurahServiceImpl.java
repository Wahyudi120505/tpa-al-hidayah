package com.project.anisaalawiyah.service.impl;



import com.project.anisaalawiyah.dto.request.RequestSurah;
import com.project.anisaalawiyah.model.Surah;
import com.project.anisaalawiyah.repository.SurahRepository;
import com.project.anisaalawiyah.service.SurahService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
@Slf4j
public class SurahServiceImpl implements SurahService {

    private final SurahRepository surahRepository;

@Override
public Surah create(RequestSurah request) throws ServiceException {
    Surah surah = new Surah(); 
    surah.setName(request.getName());
    surah.setNumber(request.getNumber());

    return surahRepository.save(surah);
}

@Override
public Surah update(Long id, RequestSurah request) throws ServiceException {
    Surah surah = surahRepository.findById(id)
            .orElseThrow(() -> new ServiceException("Surah ID not found"));

    surah.setName(request.getName());
    surah.setNumber(request.getNumber());
    return surahRepository.save(surah);
}

    @Override
    public void delete(Long id) {
        Surah surah = surahRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Surah ID not found"));
        surah.setRowStatus((byte) 0);
        surahRepository.save(surah);
    }

    @Override
    public Surah findById(Long id) throws ServiceException {
        return surahRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Surah ID not found"));
    }

    @Override
    public Page<Surah> getAll(int page, int size, String query) {
        Specification<Surah> spec = (root, q, cb) -> {
            if (Strings.isBlank(query)) return null;
            return cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%");
        };

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());
        return surahRepository.findAll(spec, pageable);
    }

 
}
