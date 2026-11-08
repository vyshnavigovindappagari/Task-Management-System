package com.taskmanagement.service;

import com.taskmanagement.entity.AppUser;
import com.taskmanagement.entity.Task;
import com.taskmanagement.exception.TaskNotFoundException;
import com.taskmanagement.repository.TaskRepository;
import com.taskmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private AppUser getUser(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User account not found"));
    }

    private String normalizeStatus(String value) {
        String v = (value == null || value.isBlank()) ? "PENDING" : value.trim().toUpperCase(Locale.ROOT);
        if (!List.of("PENDING", "IN_PROGRESS", "COMPLETED").contains(v))
            throw new IllegalArgumentException("Status must be PENDING, IN_PROGRESS, or COMPLETED");
        return v;
    }

    private String normalizePriority(String value) {
        String v = (value == null || value.isBlank()) ? "MEDIUM" : value.trim().toUpperCase(Locale.ROOT);
        if (!List.of("LOW", "MEDIUM", "HIGH").contains(v))
            throw new IllegalArgumentException("Priority must be LOW, MEDIUM, or HIGH");
        return v;
    }

    @Transactional
    public Task addTask(Task task, String username) {
        task.setId(null);
        task.setStatus(normalizeStatus(task.getStatus()));
        task.setPriority(normalizePriority(task.getPriority()));
        task.setOwner(getUser(username));
        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks(String search, String status, String priority, String sort, String username) {
        Long ownerId = getUser(username).getId();
        String q = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);
        String s = status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
        String p = priority == null ? "" : priority.trim().toUpperCase(Locale.ROOT);
        if (!s.isEmpty() && !List.of("PENDING", "IN_PROGRESS", "COMPLETED").contains(s))
            throw new IllegalArgumentException("Invalid status filter");
        if (!p.isEmpty() && !List.of("LOW", "MEDIUM", "HIGH").contains(p))
            throw new IllegalArgumentException("Invalid priority filter");

        Comparator<Task> comparator;
        switch (sort == null ? "newest" : sort) {
            case "oldest": comparator = Comparator.comparing(Task::getId); break;
            case "dueDate": comparator = Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder())); break;
            case "priority": comparator = Comparator.comparingInt(t -> priorityRank(t.getPriority())); break;
            case "title": comparator = Comparator.comparing(t -> t.getTitle().toLowerCase(Locale.ROOT)); break;
            default: comparator = Comparator.comparing(Task::getId).reversed();
        }

        return taskRepository.findByOwnerId(ownerId).stream()
            .filter(t -> q.isEmpty() || t.getTitle().toLowerCase(Locale.ROOT).contains(q)
                || (t.getDescription() != null && t.getDescription().toLowerCase(Locale.ROOT).contains(q)))
            .filter(t -> s.isEmpty() || s.equalsIgnoreCase(t.getStatus()))
            .filter(t -> p.isEmpty() || p.equalsIgnoreCase(t.getPriority()))
            .sorted(comparator).toList();
    }

    private int priorityRank(String p) {
        if ("HIGH".equalsIgnoreCase(p)) return 0;
        if ("MEDIUM".equalsIgnoreCase(p)) return 1;
        return 2;
    }

    @Transactional(readOnly = true)
    public Task getTaskById(Long id, String username) {
        return taskRepository.findByIdAndOwnerId(id, getUser(username).getId())
            .orElseThrow(() -> new TaskNotFoundException("Task not found"));
    }

    @Transactional
    public Task updateTask(Long id, Task input, String username) {
        Task existing = getTaskById(id, username);
        existing.setTitle(input.getTitle());
        existing.setDescription(input.getDescription());
        existing.setDueDate(input.getDueDate());
        existing.setStatus(normalizeStatus(input.getStatus()));
        existing.setPriority(normalizePriority(input.getPriority()));
        return taskRepository.save(existing);
    }

    @Transactional
    public Task markCompleted(Long id, String username) {
        Task task = getTaskById(id, username);
        task.setStatus("COMPLETED");
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id, String username) {
        taskRepository.delete(getTaskById(id, username));
    }
}
