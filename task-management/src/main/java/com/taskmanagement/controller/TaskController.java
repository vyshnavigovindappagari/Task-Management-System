package com.taskmanagement.controller;

import com.taskmanagement.entity.Task;
import com.taskmanagement.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;
    public TaskController(TaskService taskService) { this.taskService = taskService; }

    @PostMapping
    public ResponseEntity<Task> addTask(@Valid @RequestBody Task task,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.addTask(task, user.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.getAllTasks(search, status, priority, sort, user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.getTaskById(id, user.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task task,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.updateTask(id, task, user.getUsername()));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Task> markCompleted(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.markCompleted(id, user.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        taskService.deleteTask(id, user.getUsername());
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }
}
