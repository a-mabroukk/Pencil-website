from sqlalchemy import inspect
from pencil import db

class BaseModel(db.Model):
    __abstract__ = True

    def to_dict(self, seen=None):
        """Convert model columns and relationships to dictionary."""
        if seen is None:
            seen = set()

        # Check if the current object is already in the 'seen' set to avoid recursion
        if id(self) in seen:
            return None  # Prevent infinite recursion

        # Add the current object to the 'seen' set
        seen.add(id(self))

        # First, get columns
        model_dict = {column.name: getattr(self, column.name) for column in self.__table__.columns}

        # Then, handle relationships
        for relationship in inspect(self.__class__).relationships:
            related_value = getattr(self, relationship.key)
            if relationship.uselist:  # If it's a one-to-many or many-to-many relationship
                model_dict[relationship.key] = [item.to_dict(seen=seen) for item in related_value] if related_value else []
            else:  # If it's a one-to-one or many-to-one relationship
                model_dict[relationship.key] = related_value.to_dict(seen=seen) if related_value else None

        return model_dict
