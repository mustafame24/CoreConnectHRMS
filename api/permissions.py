from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Allow access only to Admin users
    """
    def has_permission(self, request, view):
        return request.user and request.user.role.name.lower() == 'admin'


class IsHR(BasePermission):
    """
    Allow access only to HR users
    """
    def has_permission(self, request, view):
        return request.user and request.user.role.name.lower() == 'hr'


class IsEmployee(BasePermission):
    """
    Allow access only to Employee users
    """
    def has_permission(self, request, view):
        return request.user and request.user.role.name.lower() == 'employee'


class IsAdminOrHR(BasePermission):
    """
    Allow access to Admin or HR users
    """
    def has_permission(self, request, view):
        if not request.user or not hasattr(request.user, 'role'):
            return False
        role_name = request.user.role.name.lower()
        return role_name in ['admin', 'hr']


class IsAuthenticatedUser(BasePermission):
    """
    Allow access only to authenticated users
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated if hasattr(request.user, 'is_authenticated') else request.user
